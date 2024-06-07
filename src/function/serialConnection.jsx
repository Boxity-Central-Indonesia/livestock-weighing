<<<<<<< HEAD
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
        if (!port) return;
=======
import React, { useState, useEffect } from "react";

const SerialConnection = () => {
  const [ports, setPorts] = useState([]);
  const [selectedPort, setSelectedPort] = useState(null);
  const [port, setPort] = useState(null);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

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
      setError("");
    } catch (err) {
      setError("Failed to connect: " + err.message);
    }
  };

  const connect = async () => {
    if (!selectedPort) return;
    try {
      await selectedPort.open({ baudRate: 9600 });
      setPort(selectedPort);
      setError("");
    } catch (err) {
      setError("Failed to connect: " + err.message);
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
        setOutput((prevOutput) => prevOutput + value);
      }
    } catch (err) {
      console.error("Error reading data:", err);
    } finally {
      reader.releaseLock();
    }
  };

  // const writeData = async (data) => {
  //     if (!port) return;

  //     const textEncoder = new TextEncoderStream();
  //     const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
  //     const writer = textEncoder.writable.getWriter();
>>>>>>> 25949ac358d2435ee0a80faa265dde89de747b91

  //     try {
  //         await writer.write(data);
  //     } catch (err) {
  //         console.error('Error writing data:', err);
  //     } finally {
  //         writer.releaseLock();
  //     }
  // };

<<<<<<< HEAD
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
    };

    const requestPort = async () => {
        try {
            const newPort = await navigator.serial.requestPort();
            await newPort.open({ baudRate: 9600 });
            setPort(newPort);
            setError('');
            readData();  // Start reading data after the port is opened
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
            readData();  // Start reading data after the port is opened
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
            if (result.isConfirmed) {
                if (port) {
                    try {
                        await port.close();
                        setPort(null);
                        Swal.fire({
                            title: "Disconnected!",
                            text: "The serial port has been disconnected.",
                            icon: "success"
                        });
                        setHiddenFooter(false);
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
            <button onClick={requestPort} disabled={port} className={`bg-gray-200 py-2 px-4 rounded-md text-xs ${port ? `bg-[#3CCF4E] text-white` : ``}`}>{port ? 'Terhubung': 'Buka Koneksi'}</button>
            <button onClick={disconnect} className='border border-[#e02424] text-[#e02424] py-2 px-4 rounded-md ml-4 text-xs'>Putuskan</button>
            {error && <p className='text-sm mt-0.5' style={{color: 'red'}}>{error}</p>}
        </div>
    );
=======
  return (
    <div className="">
      <p className="text-sm mb-0.5">
        Koneksikan ke serial port/external devices
      </p>
      <select
        className="h-8 text-xs bg-gray-200 border-none rounded-md"
        style={{
          outline: "none",
          boxShadow: "none",
        }}
        onChange={(e) => setSelectedPort(ports[e.target.value])}
        disabled={port || ports.length === 0}
      >
        <option value="">Select Port</option>
        {ports.map((p, index) => (
          <option key={index} value={index}>
            {p.getInfo().usbVendorId || "Unknown Device"}
          </option>
        ))}
      </select>
      <button
        onClick={requestPort}
        disabled={port}
        className="px-4 py-2 ml-3 text-xs bg-gray-200 rounded-md"
      >
        Open connection
      </button>
      <button
        onClick={connect}
        disabled={!selectedPort || port}
        className="bg-[#f95b12] py-2 px-4 text-white rounded-md ml-2 text-xs"
      >
        Connect!
      </button>
      {error && (
        <p className="text-sm mt-0.5" style={{ color: "red" }}>
          {error}
        </p>
      )}
    </div>
  );
>>>>>>> 25949ac358d2435ee0a80faa265dde89de747b91
};

export default SerialConnection;
