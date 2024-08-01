import {IoMdClose} from "react-icons/io";

interface ModalProps {
    toggleModal: Function,
    title: string,
    children: React.ReactNode
}

const Modal: React.FunctionComponent<ModalProps> = ({ toggleModal, title, children }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="relative w-full max-w-3xl p-6 bg-white rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-medium">{title}</h3>
                    <div onClick={() => toggleModal()} className="cursor-pointer text-gray-600 hover:text-red-500 transition-colors duration-300"><IoMdClose size={'32px'}/></div>
                </div>
                <div className="pt-4">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;