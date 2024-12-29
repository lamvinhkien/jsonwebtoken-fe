import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ModalLogout = (props) => {
    return (
        <Modal show={props.show} onHide={props.handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Logout User</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure logout?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    No
                </Button>
                <Button variant="danger" onClick={props.handleLogout}>
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalLogout;