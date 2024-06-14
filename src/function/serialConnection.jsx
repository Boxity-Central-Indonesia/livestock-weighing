import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const SerialConnection = ({ setHiddenFooter }) => {
    const [ports, setPorts] = useState([]);
    const [selectedPort, setSelectedPort] = useState(null);
    const [port, setPort] = useState(null);
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const getPorts = async () => {
            try {
                const availablePorts = await navigator.serial.getPorts();
                const portsInfo = await Promise.all(availablePorts.map(async (port) => {
                    const info = port.getInfo();
                    return { port, info };
                }));
                setPorts(portsInfo);
                console.log('Available ports:', portsInfo);
            } catch (err) {
                console.error('Error getting serial ports:', err);
            }
        };
        getPorts();
    }, []);

    const readData = async () => {
        // if (!port) {
        //     console.error('No port available');
        //     return;
        // }
    
        // const textDecoder = new TextDecoderStream();
        // const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
        // const reader = textDecoder.readable.getReader();
        
        // try {
        //     while (true) {
        //         const { value, done } = await reader.read();
        //         if (done) {
        //             break;
        //         }
        //         console.log(value);  // Log the data
        //         setOutput(prevOutput => prevOutput + value);
        //     }
        // } catch (err) {
        //     console.error('Error reading data:', err);
        // } finally {
        //     reader.releaseLock();
        // }
    };
    

    const requestPort = async () => {
        try {
            const newPort = await navigator.serial.requestPort();
            await newPort.open({ baudRate: 9600 });
            setPort(newPort);
            setError('');

            if (!newPort) {
                console.error('No port available');
                return;
            }
            const textDecoder = new TextDecoderStream();
            const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
            const reader = textDecoder.readable.getReader();
            
            try {
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) {
                        break;
                    }
                    console.log(value);  // Log the data
                    setOutput(prevOutput => prevOutput + value);
                }
            } catch (err) {
                console.error('Error reading data:', err);
            } finally {
                reader.releaseLock();
            }
        } catch (err) {
            setError('Failed to connect: ' + err.message);
        }
    };

    const connect = async () => {
        if (!selectedPort) return;
        try {
            await selectedPort.port.open({ baudRate: 9600 });
            setPort(selectedPort.port);
            setError('');
            // readData();  // Start reading data after the port is opened
        } catch (err) {
            setError('Failed to connect: ' + err.message);
        }
    };

    const disconnect = async () => {
        setHiddenFooter(true);
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, disconnect it!"
        }).then(async (result) => {
            setHiddenFooter(false);
            if (result.isConfirmed) {
                setHiddenFooter(false);
                if (port) {
                    setHiddenFooter(false);
                    try {
                        await port.close();
                        setPort(null);
                        setHiddenFooter(false);
                        Swal.fire({
                            title: "Disconnected!",
                            text: "The serial port has been disconnected.",
                            icon: "success"
                        });
                    } catch (err) {
                        Swal.fire({
                            title: "Error!",
                            text: `Failed to disconnect: ${err.message}`,
                            icon: "error"
                        });
                        setHiddenFooter(false);
                    }
                } else {
                    Swal.fire({
                        title: "No Port",
                        text: "There is no port to disconnect.",
                        icon: "info"
                    });
                    setHiddenFooter(false);
                }
            } else {
                setHiddenFooter(false);
            }
        });
    };


    return (
        <div className=''>
            <p className='text-sm mb-1'>Koneksi kan ke serial port</p>
            <button onClick={requestPort} disabled={port} className={`py-2 px-4 rounded-md text-xs ${port ? `bg-[#3CCF4E] text-white` : `bg-gray-200`}`}>{port ? 'Terhubung': 'Buka Koneksi'}</button>
            <button onClick={disconnect} className={`border border-[#e02424] ${port ? `` : `hidden`} text-[#e02424] py-2 px-4 rounded-md ml-4 text-xs`}>Putuskan</button>
            {error && <p className='text-sm mt-0.5' style={{color: 'red'}}>{error}</p>}
        </div>
    );
};

export default SerialConnection;
