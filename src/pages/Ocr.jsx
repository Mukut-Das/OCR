import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner, Alert, Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from "axios";
const OCR = () => {
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [recognizedText, setRecognizedText] = useState('');
    console.log(process.env,"k")

    const handleImageUpload = async (event) => {
        event.stopPropagation();
        event.preventDefault();
        const files = event.target.files;

        if (files.length === 0) {
            setError('Please select an image file.');
            return;
        }

        const formData = new FormData();
        formData.append('apikey', process.env.REACT_APP_OCR_SPACE_API_KEY);
        formData.append('file', files[0]);

        setIsLoading(true);
        setError('');
        setIsSuccess(false);

        try {
            const response = await axios.post('https://api.ocr.space/parse/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.IsErroredOnProcessing) {
                setError(response?.data?.ErrorMessage);
                setIsLoading(false);
                return;
            }

            const parsedText = await response.data.ParsedResults[0].ParsedText;
            if(parsedText.length>0){
                setRecognizedText(parsedText);
            }else{
                setRecognizedText("");
            }
           
            setIsSuccess(true);
            setIsLoading(false);
        } catch (error) {
            console.error('Error during the OCR process:', error);
            setError('Error during the OCR process');
            setIsLoading(false);
        }
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Upload an image for OCR</Form.Label>
                            <Form.Control type="file" onChange={handleImageUpload} accept="image/*" />
                        </Form.Group>
                    </Form>
                    {isLoading && (
                        <div className="text-center my-3">
                            <Spinner animation="border" variant="primary" />
                            <div>Loading...</div>
                        </div>
                    )}
                    {error && <Alert variant="danger">{error}</Alert>}
                    {isSuccess &&
                        <Alert variant={recognizedText.length > 0 ?"success":"danger"}>
                           {recognizedText.length > 0 ? `Image contains the following text: ${recognizedText}` : "Image contains no text"}
                        </Alert>
                    }
                </Col>
            </Row>
        </Container>
    );
};

export default OCR;
