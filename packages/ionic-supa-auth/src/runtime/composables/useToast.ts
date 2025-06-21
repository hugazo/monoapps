import type HTMLIonToastElement from '@ionic/core/components/ion-toast';
import {
  alertCircle,
  checkmarkCircle,
} from 'ionicons/icons';
import { toastController } from '#imports';

const commonToastOptions: Pick<HTMLIonToastElement, 'duration' | 'position'> = {
  duration: 3000,
  position: 'top',
};

export const useToast = () => {
  const showSuccessToast = async (message: string) => {
    const toast = await toastController.create({
      message,
      ...commonToastOptions,
      color: 'success',
      icon: checkmarkCircle,
    });
    await toast.present();
  };

  const showErrorToast = async (message: string) => {
    const toast = await toastController.create({
      message,
      ...commonToastOptions,
      color: 'danger',
      icon: alertCircle,
    });
    await toast.present();
  };

  return {
    showSuccessToast,
    showErrorToast,
  };
};
