import { useState } from 'react'
import { BoekToevoegenStyling } from './BoekToevoegenStyling';

function ExemplarenToevoegen(props) {


    const [hoeveelheid, setHoeveelheid] = useState(1);
    const [labels, setLabels] = useState([])
    const [uit, setUit] = useState(false)

    const bevestig = (e) => {
        setUit(true);
        voegExemplarenToe("http://localhost:8080/opslaanexemplaar/" + props.boekID+ "/" +hoeveelheid, {}).then(response => {
            if (response.ok) {
                response.json().then(ids => {
                    let labels = [];
                    Array.from(ids, id=> {
                        labels.push("WT-" + props.boekID + "." + id);
                    })
                    setLabels(labels);

                })
            } else setUit(false);
        }).catch(error => {
            console.log(error)
            setUit(false);
        })

        e.preventDefault();

    }



    if (props.boekToegevoegd) {
        return (
            <BoekToevoegenStyling>
            <div>
                <form onSubmit={bevestig}>
                    <h2>Exemplaar hoeveelheid:</h2>
                    <input className = 'klikveld' type="number" value={hoeveelheid} min={1}
                        disabled={uit}
                        onChange={e => setHoeveelheid(e.target.value)} />
                    <input className='submit2' type ="submit" disabled={uit} value = "Bevestig"/>
                </form>
                <h3>Gegenereere labels:</h3>
                <ul>
                    {labels.map((label, index) => <li key={index}>{label}</li>)}
                </ul>
            </div>
            </BoekToevoegenStyling>
        )
    } else {
        return null;
    }
}

const voegExemplarenToe = async (url, boekID) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(boekID)
    })
    return response;
}

export default ExemplarenToevoegen;