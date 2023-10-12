import {
  DialogActions,
  DialogPrimaryAction,
  DialogSecondaryAction,
} from './actions';
import { DialogBody } from './body';
import { DialogHeader } from './header';
import { DialogModal, DialogModalProps } from './modal';
import { DialogSection } from './section';

const Dialog = {
  Header: DialogHeader,
  Modal: DialogModal,
  Body: DialogBody,
  Actions: DialogActions,
  PrimaryAction: DialogPrimaryAction,
  SecondaryAction: DialogSecondaryAction,
  Section: DialogSection,
};

export type { DialogModalProps };
export { Dialog };
