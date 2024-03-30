import React, { useRef, useState } from 'react';
import { Container, Typography, Button, Paper, CssBaseline, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const VITE_OPEN_API_KEY = '';
const model = "whisper-1";

const Input = styled('input')({
    display: 'none',
});

const Example = () => {
    const inputRef = useRef();
    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState('');
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // State to track loading status

    const onChangeFile = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const fileURL = URL.createObjectURL(selectedFile);
            setFileUrl(fileURL);
        }
    };

    const handleProcess = async () => {
        if (!file) return;
        
        setIsLoading(true); // Start loading
        const formData = new FormData();
        formData.append("model", model);
        formData.append("file", file);

        try {
            const res = await axios.post("https://api.openai.com/v1/audio/transcriptions", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${VITE_OPEN_API_KEY}`
                },
            });
            console.log(res.data);
            setResponse(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false); // End loading
        }
    };

    const copyToClipboard = () => {
        if (response && response.text) {
            navigator.clipboard.writeText(response.text)
                .then(() => alert('Text copied to clipboard'))
                .catch(err => console.error('Failed to copy text: ', err));
        }
    };

    return (
        <Container component="main" maxWidth="sm">
          <CssBaseline />
          <Paper elevation={3} style={{ padding: "20px", borderRadius: "8px", marginTop: "20px" }}>
            <Typography variant="h5" component="h1" gutterBottom>
              Whisper
            </Typography>
            <label htmlFor="contained-button-file">
              <Input accept="audio/*,video/*" id="contained-button-file" multiple type="file" onChange={onChangeFile} ref={inputRef} />
              <Button variant="contained" component="span">
                Upload File
              </Button>
            </label>
            {file && (file.type.startsWith('audio/') ? (
                <audio controls src={fileUrl} style={{ width: '100%', marginTop: '20px' }}/>
            ) : (
                <video controls src={fileUrl} style={{ width: '100%', marginTop: '20px' }}/>
            ))}
            {file && !isLoading && <Button variant="contained" onClick={handleProcess} style={{ marginTop: '20px' }}>
              Process
            </Button>}
            {isLoading && <CircularProgress style={{ display: 'block', margin: '20px auto' }} />}
            {response && <>
                <Typography style={{ whiteSpace: "pre-wrap", marginTop: "20px" }}>
                    {JSON.stringify(response, null, 2)}
                </Typography>
                <Button variant="contained" onClick={copyToClipboard} style={{ marginTop: "20px" }}>
                    Copy Text
                </Button>
            </>}
          </Paper>
        </Container>
      );
    }

export default Example;
