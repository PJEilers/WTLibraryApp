import './PersoonInformatie.css';
import { useState, useEffect } from "react";
import { Button } from '../../Styling/Button'
import { connectieString, postRequest, uitleningToevoegen } from '../../../Constanten';
import Popup from 'reactjs-popup';
import ExemplaarInformatie from '../Boeken/ExemplaarInformatie';
import { TableStyle } from '../../Styling/Table';


function PersoonInformatie(props) {

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [personen, setPersonen] = useState([]);
    const [gezochtePersonen, setGezochtePersonen] = useState([]);
    const [naam, setNaam] = useState('')
    const [succesBericht, setSuccesBericht] = useState('');
    const [uitleningToegevoegd, setUitleningToegevoegd] = useState(false);
    const [huidigPersoon, setHuidigPersoon] = useState(null);
    const [nieuweUitlening, setNieuweUitlening] = useState(false);


    const haalPersonenOp = () => {
        fetch("http://localhost:8080/personen/")
            .then((res) => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    if (Object.entries(result).length > 0) {
                        setPersonen(result);
                        setSuccesBericht("Gevonden!")
                        setGezochtePersonen(result);
                    } else {
                        setSuccesBericht("Geen overeenkomend persoon gevonden")
                    }

                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    };

    useEffect(() => {
        haalPersonenOp();
    }, []);

    const haalPersonenOpNaam = (naam) => {
        setNaam(naam);

        let filterData = personen.filter(v => v.naam.toLowerCase().includes(naam.toLowerCase()));
        if (Object.entries(filterData).length > 0) {
            setGezochtePersonen(filterData);
            setSuccesBericht("Personen gevonden")
        } else {
            setGezochtePersonen(personen);
            setSuccesBericht("Geen overeenkomend persoon gevonden")
        }

    };

    const setUitleningInfo = (persoon) => {
        setNieuweUitlening(true);
        setHuidigPersoon(persoon.id);
        setUitleningToegevoegd(false);
    }

    return (
        <div>
            <input type="string" defaultValue={naam}
                onChange={e => { haalPersonenOpNaam(e.target.value) }} />
            <button onClick={() => haalPersonenOpNaam()}>Zoek Personen</button>
            <TableStyle>
                <table>
                    <thead>
                        <tr>
                            <th>Naam</th>
                            <th>Email</th>
                            <th>Uitlenen</th>
                            {/* {props.exemplaar ? <th></th> : null} */}
                        </tr>
                    </thead>
                    <tbody>
                        {gezochtePersonen.map(persoon =>
                            <tr>
                                <td>
                                    {persoon.naam}
                                </td>
                                <td>
                                    {persoon.email}
                                </td>
                                {leenUitTabel(persoon, props.nieuweUitleningToevoegen, props.exemplaar)}
                                {props.exemplaar ?
                                    null :
                                    <td >
                                        <Button onClick={() => setUitleningInfo(persoon)}>Uitlenen</Button>
                                    </td>
                                }
                            </tr>
                        )
                        }
                    </tbody>
                </table>
            </TableStyle>
            <p>{succesBericht}</p>
            <Popup open={nieuweUitlening} modal onClose={() => setNieuweUitlening(false)}>
                <div className="modal">
                    <button className="close" onClick={() => setNieuweUitlening(false)}> &times; </button>
                    <ExemplaarInformatie persoon={huidigPersoon} boekId = {1} />
                </div>
            </Popup>
        </div>
    );


}
export default PersoonInformatie;

const leenUitTabel = (persoon, nieuweUitleningToevoegen, exemplaar) => {
    if (exemplaar) {
        return (
            <td>
                <Button onClick={() => nieuweUitleningToevoegen(persoon.id, exemplaar)}>Leen uit</Button>
            </td>
        );
    }
    return null;
}

