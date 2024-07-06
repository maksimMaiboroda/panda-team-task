<template>
    <div class="modal-overlay" @click.self="close">
        <div class="modal">
            <h3 class="modal-title">{{ title }}</h3>
            <p class="modal-description">{{ message }}</p>
            <button class="agree-btn" @click="confirm">Yes</button>
            <button class="disagree-btn" @click="close">No</button>
        </div>
    </div>
</template>

<script>
export default {
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
    methods: {
        close() {
            this.$emit('close')
        },
        confirm() {
            this.onConfirm()
            this.close()
        }
    }
}
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

.agree-btn {
    background-color: #4caf50;
}

.disagree-btn {
    background-color: #f44336;
}
</style>
