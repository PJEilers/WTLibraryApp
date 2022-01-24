import './ReserveringTabel.css';
import { useState, useEffect } from "react";
import { TableStyle } from '../../Styling/Table';
import { Button } from '../../Styling/Button'
import Popup from 'reactjs-popup';
import { uitleningToevoegen } from '../../../Constanten'
import ExemplaarInformatie from '../Boeken/ExemplaarInformatie';

function MaakReserveringTabel() {
    const[reserveringen, setReserveringen] = useState([]);
    const[opstarten, setOpstarten] = useState(false);
    const[nieuweUitlening, setNieuweUitlening] = useState(false);
    const[huidigPersoon, setHuidigPersoon] = useState(null);
    const[uitleningToegevoegd, setUitleningToegevoegd] = useState(false);
    const[huidigBoek, setHuidigBoek] = useState(null);

    const laadData = () => {

        fetch('http://localhost:8080/reserveringMetPersoonEnBoek', { mode: 'cors' })
            .then(response => response.json())
            .then(data => {
                setReserveringen(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            })

    }

    const setUitleningInfo = (persoonId, boekId) => {
        setNieuweUitlening(true);
        setHuidigPersoon(persoonId);
        setUitleningToegevoegd(false);
        setHuidigBoek(boekId);
    }

    if (!opstarten) {
        laadData();
        setOpstarten(true);
    }

    return (
        <div>
            <TableStyle>
            <table>
                <thead>
                    <tr>
                        <th>Reservering ID</th>
                        <th>Boek ID</th>
                        <th>Boek titel</th>
                        <th>Boek auteur</th>
                        <th>Persoon ID</th>
                        <th>Naam</th>
                        <th>Email</th>
                        <th>Datum</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {reserveringen.map(reservering => (
                        <tr key={reservering.id}>
                            <td>{reservering.id}</td>
                            <td>{reservering.boekId}</td>
                            <td>{reservering.titel}</td>
                            <td>{reservering.auteur}</td>
                            <td>{reservering.persoonId}</td>
                            <td>{reservering.naam}</td>
                            <td>{reservering.email}</td>
                            <td>{reservering.datum}</td>
                            <td><Button onClick={() => setUitleningInfo(reservering.persoonId, reservering.boekId)}>Uitlenen</Button></td>
                        </tr>
                    ))}

                    <Popup open={nieuweUitlening} modal onClose={() => setNieuweUitlening(false)}>
                        <div className="modal">
                            <button className="close" onClick={() => setNieuweUitlening(false)}> &times; </button>
                            <ExemplaarInformatie persoon = {huidigPersoon} boekId = {huidigBoek}/>
                        </div>
                    </Popup>
                </tbody>
            </table>
            </TableStyle>
        </div>
    );
}

export default MaakReserveringTabel;