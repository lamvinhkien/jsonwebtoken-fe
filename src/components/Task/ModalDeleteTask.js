import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ModalDeleteTask = (props) => {
    return (
        <>
            <Modal show={props.show} onHide={props.hide} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure delete this task?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.hide}>
                        No
                    </Button>
                    <Button variant="danger" onClick={props.delete}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalDeleteTask;