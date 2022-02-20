import React, {useState} from 'react';
import {QrReader} from 'react-qr-reader';

export default function ScanScreen() {
    const [data, setData] = useState('');

    return (
        <div className='container-sm main_scanner_div'>
            <h6>
                Scan the QR code
            </h6>
            <div className='container-sm qr_scanner' style={{width: '50%', height: '50%'}}>
                <QrReader
                    onResult={(result, error) => {
                        if (!!result) {
                            setData(result?.text);
                        }

                        if (!!error) {
                            console.info(error);
                        }
                    }}
                />
            </div>
            <div>
                <p>{data}</p>
            </div>

        </div>
    )
}
