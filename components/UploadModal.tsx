"use client";

import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';
import Modal from './Modal';
import useUploadModal from '@/hooks/useUploadModal';

const UploadModal = () => {

    const uploadModal = useUploadModal();

    const {
        register,
        handleSubmit,
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            author: '',
            title: '',
            song: null,
            image: null,
        }
    })

    const onChange = (open: boolean) => {
        if (!open) {
            reset();
            uploadModal.onClose();
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        // upload to supabase
    }


  return (
    <Modal
        title= "Add a song"
        description="Upload an mp3 file"
        isOpen={uploadModal.isOpen}
        onChange={onChange}
    >
        <form 
        onSubmit={handleSubmit(onSubmit)}
        >
            {/* aqui poner el input 2:32:25 */}
        </form>
    </Modal>
  );
}

export default UploadModal