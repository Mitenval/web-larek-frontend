import { EVENT_TYPES } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export interface IModalData {
	content: HTMLElement;
}

export class Modal extends Component<IModalData> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		container.addEventListener('click', this.close.bind(this));
		this._closeButton.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (evt) => evt.stopPropagation());
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open() {
		this.container.classList.add('modal_active');
		this.events.emit(EVENT_TYPES.MODAL_OPEN);
		document.addEventListener('keydown', this.closeEsc);
	}

	close() {
		this.container.classList.remove('modal_active');
		this.content = null;
		this.events.emit(EVENT_TYPES.MODAL_CLOSE);
		document.removeEventListener('keydown', this.closeEsc);
	}

	closeEsc = (evt: KeyboardEvent) => {
		if (evt.key === 'Escape') {
			this.close();
		}
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}