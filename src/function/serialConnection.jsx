import React, { useState, useEffect } from 'react';

const SerialConnection = () => {
    const [ports, setPorts] = useState([]);
    const [selectedPort, setSelectedPort] = useState(null);
    const [port, setPort] = useState(null);
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const getPorts = async () => {
            const availablePorts = await navigator.serial.getPorts();
            setPorts(availablePorts);
            console.log(availablePorts);
        };
        getPorts();
    }, []);

    const requestPort = async () => {
        try {
            const newPort = await navigator.serial.requestPort();
            await newPort.open({ baudRate: 9600 });
            setPort(newPort);
            setError('');
        } catch (err) {
            setError('Failed to connect: ' + err.message);
        }
    };

    const connect = async () => {
        if (!selectedPort) return;
        try {
            await selectedPort.open({ baudRate: 9600 });
            setPort(selectedPort);
            setError('');
        } catch (err) {
            setError('Failed to connect: ' + err.message);
        }
    };

    const disconnect = async () => {
        if (port) {
            await port.close();
            setPort(null);
        }
    };

    const readData = async () => {
        if (!port) return;

        const textDecoder = new TextDecoderStream();
        const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
        const reader = textDecoder.readable.getReader();

        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) {
                    break;
                }
                setOutput(prevOutput => prevOutput + value);
            }
        } catch (err) {
            console.error('Error reading data:', err);
        } finally {
            reader.releaseLock();
        }
    };

    // const writeData = async (data) => {
    //     if (!port) return;

    //     const textEncoder = new TextEncoderStream();
    //     const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
    //     const writer = textEncoder.writable.getWriter();

    //     try {
    //         await writer.write(data);
    //     } catch (err) {
    //         console.error('Error writing data:', err);
    //     } finally {
    //         writer.releaseLock();
    //     }
    // };

    return (
        <div className=''>
            <p className='text-sm mb-0.5'>Koneksi kan ke serial port</p>
            <select
                className='bg-gray-200 h-8 border-none rounded-md text-xs'
                style={{
                    outline: 'none',
                    boxShadow: 'none'
                }}
                onChange={(e) => setSelectedPort(ports[e.target.value])}
                disabled={port || ports.length === 0}
            >
                <option value="">Select Port</option>
                {ports.map((p, index) => (
                    <option key={index} value={index}>
                        {p.getInfo().usbVendorId || 'Unknown Device'}
                    </option>
                ))}
            </select>
            <button onClick={requestPort} disabled={port} className='bg-gray-200 py-2 px-4 rounded-md ml-3 text-xs'>Buka koneksi</button>
            <button onClick={connect} disabled={!selectedPort || port} className='bg-[#f95b12] py-2 px-4 text-white rounded-md ml-2 text-xs'>Hubungkan</button>
            {error && <p className='text-sm mt-0.5' style={{color: 'red'}}>{error}</p>}
        </div>
    );
};

export default SerialConnection;
