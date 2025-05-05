<template>
  <ion-grid class="items-center">
    <ion-row class="ion-justify-content-center">
      <ion-input
        v-for="(ids, index) in props.passLength"
        :key="ids"
        :value="inputValues[index]"
        class="pin-input"
        :placeholder="props.placeholder"
        :index="index"
        type="text"
        inputmode="numeric"
        :min-length="1"
        :max-length="1"
        min="0"
        max="9"
        :disabled="props.disabled"
        @ion-focus="handleFocus($event)"
        @ion-input="handleIonInput($event, index)"
        @keydown.delete="handleDeleteKey($event)"
        @keydown.left="handleLeftKey($event)"
        @keydown.right="handleRightKey($event)"
        @ion-blur="handleBlur($event)"
        @click="handleClick($event)"
        @paste="handlePaste($event)"
      />
    </ion-row>
    <ion-row class="ion-justify-content-center">
      <ion-button
        :disabled="!validInput || props.disabled"
        expand="block"
        class="mt-4"
        @click="emit('finishedInput', finalValue)"
      >
        {{ props.sendButtonText }}
      </ion-button>
      <ion-button
        :disabled="!validInput || props.disabled"
        expand="block"
        class="mt-4"
        @click="resetInput"
      >
        {{ props.resetButtonText }}
      </ion-button>
    </ion-row>
  </ion-grid>
</template>

<script setup lang="ts">
interface CustomIonInputElement extends HTMLIonInputElement {
  nativeInput: HTMLInputElement;
}

const props = defineProps({
  passLength: {
    type: Number,
    default: 6,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  sendAfterFinished: {
    type: Boolean,
    default: true,
  },
  sendButtonText: {
    type: String,
    default: 'Send Pin',
  },
  resetButtonText: {
    type: String,
    default: 'Reset Pin',
  },
  resetButton: {
    type: Boolean,
    default: false,
  },
  sendAfterPaste: {
    type: Boolean,
    default: true,
  },
  placeholder: {
    type: String,
    default: 'X',
  },
});

const emit = defineEmits<{
  (event: 'finishedInput', value: string): void;
}>();

const inputValues = ref<string[]>([]);

const finalValue = computed(() => {
  return inputValues.value.join('');
});

const validInput = computed(() => {
  return finalValue.value.length === props.passLength && Number.isInteger(Number(finalValue.value));
});

const handleDeleteKey = (event: KeyboardEvent) => {
  if ((event.target as HTMLIonInputElement)?.value === '') {
    const prevInput = (event.currentTarget as HTMLIonInputElement).previousElementSibling as HTMLIonInputElement;

    if (prevInput) {
      prevInput.setFocus();
      event.preventDefault();
    }
  }
};

const handlePaste = (event: ClipboardEvent) => {
  const clipboardData = event.clipboardData;
  if (clipboardData) {
    const pastedData = clipboardData.getData('text/plain');
    // Check if the pasted data is a number and has the correct length
    if (pastedData.length === props.passLength && Number.isInteger(Number(pastedData))) {
      event.preventDefault();
      const target = event.target as HTMLIonInputElement;
      if (target) {
        target.blur();
      }
      updateInputValues(pastedData);
      if (props.sendAfterPaste) {
        emit('finishedInput', finalValue.value);
      }
    }
    else {
      event.preventDefault();
      console.error('Invalid pasted data:', pastedData);
    }
  }
};

const handleIonInput = (event: CustomEvent, currentIndex: number) => {
  const input = event.target as CustomIonInputElement;
  const value = event.detail.value;
  const nextInput = input.nextElementSibling as HTMLIonInputElement;

  // Handles non-numeric input
  if (Number.isNaN(Number(value))) {
    // Checks if the input has a value
    const currentValue = inputValues.value[currentIndex];

    if (currentValue) {
      if (event.currentTarget) {
        (event.currentTarget as HTMLIonInputElement).value = currentValue;
      }
    }
    else {
      inputValues.value[currentIndex] = '';
      (event.currentTarget as HTMLIonInputElement).value = '';
    }
    return;
  }
  // After this point, we know the input is numeric

  // Handles manual value correction with keyboard
  if (value.length >= 2) {
    const currentValue = inputValues.value[currentIndex];
    const fixedValue = value.replace(currentValue, '');
    if (event.currentTarget) {
      (event.currentTarget as HTMLIonInputElement).value = fixedValue;
      inputValues.value[currentIndex] = fixedValue;
    }
    if (nextInput) {
      nextInput.setFocus();
    }
    else {
      input.nativeInput.blur();
      handleFinishedPinInput();
    }
    return;
  }

  // Handles empty input (backspace or deletion)
  if (value.length === 0) {
    const prevInput = input.previousElementSibling as HTMLIonInputElement;
    if (prevInput) {
      prevInput.setFocus();
    }
    return;
  }

  // Handles single character input
  if (value.length === 1) {
    inputValues.value[currentIndex] = value;
    if (nextInput) {
      nextInput.setFocus();
    }
    else {
      // We unfocus only if all inputs are filled
      if (validInput.value) {
        input.nativeInput.blur();
        handleFinishedPinInput();
      }
    }
    return;
  }
};

const handleFinishedPinInput = () => {
  if (props.sendAfterFinished) {
    emit('finishedInput', finalValue.value);
  }
};

const updateInputValues = (value: string) => {
  [...value].forEach((char, index) => {
    inputValues.value[index] = char;
  });
};

const handleFocus = (event: CustomEvent) => {
  const target = event.target as CustomIonInputElement;
  if (target) {
    target.style.background = 'var(--ion-color-primary)';
    target.style.transition = 'background 0.3s ease-in-out';
    if (target.nativeInput.value.length) {
      target.nativeInput.setSelectionRange(0, target.nativeInput.value.length);
    }
  }
};

const handleBlur = (event: CustomEvent) => {
  const target = event.target as HTMLIonInputElement;
  if (target) {
    target.style.background = 'transparent';
  }
};

const handleLeftKey = (event: KeyboardEvent) => {
  const target = event.currentTarget as HTMLIonInputElement;
  if (target) {
    const prevInput = target.previousElementSibling as HTMLIonInputElement;
    if (prevInput) {
      prevInput.setFocus();
      event.preventDefault();
    }
  }
};

const handleRightKey = (event: KeyboardEvent) => {
  const target = event.currentTarget as HTMLIonInputElement;
  if (target) {
    const nextInput = target.nextElementSibling as HTMLIonInputElement;
    if (nextInput) {
      nextInput.setFocus();
      event.preventDefault();
    }
  }
};

const handleClick = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLIonInputElement;
  if (target) {
    target.setFocus();
    event.preventDefault();
  }
};

const resetInput = () => {
  inputValues.value = [];
};
</script>

<style>
ion-input.pin-input {
  width: 3rem;
  height: 3rem;
  margin: 0 0.3rem;
  text-align: center;
  font-size: 2rem;
  border-radius: 14px;
  --highlight-color-focused: transparent;
  ::selection {
    background: transparent;
  }
}
</style>
