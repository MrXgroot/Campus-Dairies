import CommentModal from "../../components/comment/CommentModal";
import useModalStore from "../../store/modalStore";

function ModalProvider({ children }) {
  const { showCommentModal, closeCommentModal } = useModalStore();

  return (
    <>
      {children}

      {showCommentModal && <CommentModal onClose={closeCommentModal} />}
    </>
  );
}

export default ModalProvider;
