import {connectieString, postRequest} from "../../../Constanten.js"
import {useState} from "react"
import { Button } from '../../Styling/Button'

function Reserveren (props) {

    const [succesBericht, setSuccesBericht] = useState('')

    const maakReservering = () => {
        
        const reserveringData = {
            boekId : props.boekId,
            persoonId : props.persoonId,
            datum : new Date().toISOString().split('T')[0]
        }

        postRequest(connectieString + "/maakreserveringaan", reserveringData).then(response => {
            if (response.ok) {
                response.json().then(reservering => {
                    if (reservering.bestaat) {
                        setSuccesBericht("Reservering bestaat al")
                        
                    } else {
                        setSuccesBericht("Reservering is succesvol toegevoegd")
                    }
                })              
            } else {
                setSuccesBericht("Er is iets fout gegeaan")
            }
        }).catch(error => {
            setSuccesBericht("Er is iets fout gegeaan")
        })
    }
    
    return (
        <div>
            <Button buttonSize = 'btn--small' onClick={() => maakReservering()}>Reserveer</Button> <span>{succesBericht}</span>
        </div>
    )
}

export default Reserveren;