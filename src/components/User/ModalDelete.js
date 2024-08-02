import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ModalDelete = (props) => {
    return (
        <Modal show={props.show} onHide={props.hideConfirm} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirm delete {props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure delete this {props.title}: <span className="fw-medium">{props.dataModal}</span> ?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.hideConfirm}>
                    Close
                </Button>
                <Button variant="danger" onClick={props.handleDeleteUser}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalDelete;