<template>
    <div class="modal-overlay" @click.self="close">
        <div class="modal">
            <h3 class="modal-title">{{ title }}</h3>
            <p class="modal-description">{{ message }}</p>
            <button class="confirm-btn" @click="handleConfirm">
                {{ $t('confirmModal.confirmBtn') }}
            </button>
            <button class="close-btn" @click="close">{{ $t('confirmModal.closeBtn') }}</button>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
    name: 'ConfirmModal',
    props: {
        title: {
            type: String,
            default: 'Confirm'
        },
        message: {
            type: String,
            default: 'Are you sure you want to proceed?'
        },
        onConfirm: {
            type: Function,
            required: true
        }
    },
    setup(props, { emit }) {
        const { t } = useI18n()

        const close = () => {
            emit('close')
        }

        const handleConfirm = () => {
            props.onConfirm()
            close()
        }

        return {
            t,
            close,
            handleConfirm
        }
    }
})
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}
.modal {
    background: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
}

.modal-title {
    margin-bottom: 12px;
}

.modal-description {
    margin-bottom: 12px;
}

button {
    margin: 10px 15px;
    padding: 8px 24px;
    border: 1px solid white;
    color: white;
    border-radius: 4px;
}

.confirm-btn {
    background-color: #4caf50;
}

.close-btn {
    background-color: #f44336;
}
</style>
