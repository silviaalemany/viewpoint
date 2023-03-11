import MaterialIcon, {colorPalette} from 'material-icons-react';
import Button from 'react-bootstrap/Button';

export default function AddButton() {

    return (
    <Button className="AddButton" variant="primary">
        <MaterialIcon icon="add" color="black"></MaterialIcon>
    </Button>
    );
}