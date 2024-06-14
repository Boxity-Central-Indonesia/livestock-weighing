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
                console.log('Port yang tersedia:', portsInfo);
            } catch (err) {
                console.error('Error mendapatkan port serial:', err);
            }
        };
        getPorts();
    }, []);

    const readData = async () => {
        if (!port) {
            console.error('Tidak ada port yang tersedia');
            return;
        }

        if (!port.readable) {
            console.error('Port tidak dapat dibaca');
            setError('Port tidak dapat dibaca');
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
                console.log(value);  // Log data
                setOutput(prevOutput => prevOutput + value);
            }
        } catch (err) {
            console.error('Error membaca data:', err);
            setError('Error membaca data: ' + err.message);
        } finally {
            reader.releaseLock();
        }
    };

    const requestPort = async () => {
        try {
            const newPort = await navigator.serial.requestPort();
            await newPort.open({ baudRate: 9600 });
            console.log('Port berhasil dibuka:', newPort);
            setPort(newPort);
            setError('');
            // Tunggu sebentar sebelum membaca
            setTimeout(() => {
                if (!newPort) {
                    console.error('Tidak ada port yang tersedia');
                    return;
                }
        
                if (!newPort.readable) {
                    console.error('Port tidak dapat dibaca');
                    setError('Port tidak dapat dibaca');
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
                        console.log(value);  // Log data
                        setOutput(prevOutput => prevOutput + value);
                    }
                } catch (err) {
                    console.error('Error membaca data:', err);
                    setError('Error membaca data: ' + err.message);
                } finally {
                    reader.releaseLock();
                }
            }, 100); // Tunggu 100ms
        } catch (err) {
            setError('Gagal terhubung: ' + err.message);
            console.error('Gagal terhubung: ', err);
        }
    };

    const connect = async () => {
        if (!selectedPort) {
            setError('Tidak ada port yang dipilih');
            return;
        }
        try {
            await selectedPort.port.open({ baudRate: 9600 });
            console.log('Port berhasil dibuka:', selectedPort.port);
            setPort(selectedPort.port);
            setError('');
            // Tunggu sebentar sebelum membaca
            setTimeout(() => {
                readData();  // Mulai membaca data setelah port dibuka
            }, 100); // Tunggu 100ms
        } catch (err) {
            setError('Gagal terhubung: ' + err.message);
            console.error('Gagal terhubung: ', err);
        }
    };

    const disconnect = async () => {
        setHiddenFooter(true);
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Anda tidak akan dapat mengembalikan ini!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, putuskan!"
        }).then(async (result) => {
            setHiddenFooter(false);
            if (result.isConfirmed) {
                if (port) {
                    try {
                        await port.close();
                        setPort(null);
                        Swal.fire({
                            title: "Terputus!",
                            text: "Port serial telah terputus.",
                            icon: "success"
                        });
                    } catch (err) {
                        Swal.fire({
                            title: "Error!",
                            text: `Gagal memutuskan: ${err.message}`,
                            icon: "error"
                        });
                    }
                } else {
                    Swal.fire({
                        title: "Tidak Ada Port",
                        text: "Tidak ada port untuk diputuskan.",
                        icon: "info"
                    });
                }
            }
        });
    };

    return (
        <div className=''>
            <p className='text-sm mb-1'>Koneksikan ke serial port</p>
            <button onClick={requestPort} disabled={port} className={`py-2 px-4 rounded-md text-xs ${port ? `bg-[#3CCF4E] text-white` : `bg-gray-200`}`}>{port ? 'Terhubung' : 'Buka Koneksi'}</button>
            <button onClick={disconnect} className={`border border-[#e02424] ${port ? `` : `hidden`} text-[#e02424] py-2 px-4 rounded-md ml-4 text-xs`}>Putuskan</button>
            {error && <p className='text-sm mt-0.5' style={{color: 'red'}}>{error}</p>}
        </div>
    );
};

export default SerialConnection;
