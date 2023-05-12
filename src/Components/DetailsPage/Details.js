import React,{useEffect, useState} from 'react'
import '../../Styles/Details.css'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { json, Link, useParams } from 'react-router-dom';
import Modal from 'react-modal';
import { getByDisplayValue, getDefaultNormalizer } from '@testing-library/react';
import { isDisabled } from '@testing-library/user-event/dist/utils';
import ManageAccount from '../ManageAccount/ManageAccount';


export default function Details() {

    const {rName}=useParams();

    // const[login,setLogin]=useState(false);
    // const[createAcc,setAcc]=useState(false);
    const [placeOrder,setPlaceOrder]=useState(false);
    const [menu,setMenu]=useState([]);
    const[restaurant,SetRestaurant]=useState({});
    const [totalPrice,setTotalPrice]=useState(0);
    const [payment,setPayment]=useState(false);
    const [orderName,setOrderName]=useState(undefined);
    const [orderMail,setOrderMail]=useState(undefined);
    const [orderNumber,setOrderNumber]=useState(undefined);
    const [amountBtnDisabled,setAmountBtnDisabled]=useState(false);
    
    useEffect(()=>{
        fetch(`https://backend-node-zomato-dharineesh-gg.onrender.com/zomato/details/${rName}`)
        .then((response)=>response.json())
    .then((data)=>SetRestaurant(data.data))
    },[])

    
    const customStyles3 = {
        content: {
          height:'90%',
          width:'90%',  
        //   top: '50%',
        //   left: '50%',
        //   right: 'auto',
        //   bottom: 'auto',
        //   marginRight: '-50%',
        //   transform: 'translate(-50%, -50%)',
          boxShadow:' 3px 3px 9px 2px grey',
        },
        MediaQueryList:{}
      };   
    
    const getMenu=()=>{
        fetch(`https://backend-node-zomato-dharineesh-gg.onrender.com/zomato/menu/${rName}`,{method:'GET'})
        .then((response)=>response.json())
        .then((data)=>{
            data.data=data.data.map((item,index)=>{return{...item,qty:0,key:index}})
            setMenu(data.data);
        })
    };

    // console.log(menu);
    // var s={...menu};
    // console.log(s);
    // console.log([...menu]);

    // const responseFacebook = (response) => {
    //     console.log(response);
    //   }
    // const responseGoogle = (response) => {
    //     console.log(response);
    //   }

    const numberLimit=()=>{
        document.querySelectorAll('input[type="number"]').forEach(input=>{
            input.oninput=()=>{
                if(input.value.length > input.maxLength) input.value=input.value.slice(0,input.maxLength);
            }
        })
    }

      
    let loadScript=async()=>{
        let script=document.createElement('script');
        script.setAttribute("src","https://checkout.razorpay.com/v1/checkout.js");
        script.onload= async()=>{
            // document.body.appendChild(script);
            return true;
        };
        script.onerror=async()=>{
            return false;
        }
        document.body.appendChild(script);
        
    }  
    const makePayment=async()=>{

        let load=await loadScript();
        if(load)
         return true;

         
       {/* <script src="https://checkout.razorpay.com/v1/checkout.js"></script> */}
       let response= await fetch(`https://backend-node-zomato-dharineesh-gg.onrender.com/zomato/get-order-id`,{
          method:'POST',
          headers:{
            "Content-Type":"application/json",
          },
          body:JSON.stringify({amount:totalPrice}),
       })
       let order=response.json();

        var options = {
            key: "rzp_test_RB0WElnRLezVJ5", // Enter the Key ID generated from the Dashboard
            amount: totalPrice*100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: order.currency,
            name: "ZOMATO 1.0",
            description: `Make Your Order With ${rName} restaurant`,
            image: "https://seeklogo.com/images/Z/zomato-logo-200607EC4C-seeklogo.com.png",
            order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            handler: function (response){
                alert(response.razorpay_payment_id);
                alert(response.razorpay_order_id);
                alert(response.razorpay_signature)
            },
            prefill: {
                "name": orderName,
                "email": orderMail,
                "contact": orderNumber,
            },
            notes: {
                "address": "Razorpay Corporate Office"
            },
            theme: {
                "color": "#3399cc"
            }
        };
        try{
            var rzp1 = new window.Razorpay(options);
            rzp1.open();
        }catch(e){
            alert(e);
        }
    }
    
  return (
    <div>
        <ManageAccount/>
        <center>
        <div className='imageTag'>
            <img src={restaurant.thumb} height='430px' width='95%'></img>
        </div></center>
        <div className='bakeryName'>
            <span><h2>{restaurant.name}</h2></span> <button className='btn btn-danger orderButton' onClick={()=>{
                setPlaceOrder(true);
                getMenu()
                }}>
                    Place Online Order
                </button>
            <div className='Tabsall'>
            <Tabs>
                <TabList>
                <Tab>Overview</Tab>
                <Tab>Contact</Tab>
                </TabList>

                <TabPanel>
                <h2>About the place</h2>
                <h4>Cuisine</h4>
                {!(restaurant.Cuisine==undefined) && (restaurant.Cuisine.length) && 
                   <ul>
                        {
                           restaurant.Cuisine.map((item,index)=><li key={index}>{item.name}</li>)
                        }
                   </ul>}
                <h4>Meal Type</h4>
                {!(restaurant.type==undefined) && (restaurant.type.length) && 
                    <ul>{
                        restaurant.type.map((item,index)=><li key={index}>{item.name}</li>)
                    }</ul>}
                <h4>Average Cost</h4>
                &#8377;{restaurant.cost}
                </TabPanel>

                <TabPanel>
                <h4>Phone</h4>
                {restaurant.contact_number}
                <h4>Address</h4>
                {restaurant.address}
                </TabPanel>
            </Tabs>
            </div>
        </div>


        <Modal
          isOpen={placeOrder}
        // isOpen={false}
        style={ customStyles3}
          
        >
           <header className='paynow-div'> 
            <span><button className='x' onClick={()=>{setPlaceOrder(false);setTotalPrice(0)}}>x</button></span>
            <span><h2>Place Your Order</h2></span> <br/>
            <span><h4 className='total'>Total: &nbsp;{totalPrice}</h4></span>
             <button
              className={totalPrice<=0 ? 'paybtn btn btn-black': 'paybtn btn btn-danger'}
              disabled={totalPrice<=0 ? true:false}
              onClick={()=>{
                setPayment(true);
              }}
            >
                Pay Now
            </button>
            </header>
            <br/><br/>
            {
                menu.length &&  menu.map((item,index)=><div key={index}>
                <div className='menu_heading'>
                  <img className='menu_poster' src={item.thumb}/>
                  <div><h5 className='itemName'>{item.itemName}</h5>&nbsp;{item.isVeg ? <sub className='veg'>Veg</sub>:<sub className='non-veg'>Non-Veg</sub>}</div>
                </div>
                <p>{item.itemDescription}</p>
                &#8377;{item.itemPrice}&nbsp;<span>
                    <button 
                       value={item.itemPrice}
                       onClick={(e)=>{
                             setTotalPrice((totalPrice>=0)&&(totalPrice+Number(e.target.value)));
                             var menu_1=[...menu];
                             menu_1[index].qty+=1;
                             setMenu(menu_1);
                            }
                        }
                       className='btn btn-outline-secondary btn-sm'>
                          +
                    </button>
                    &nbsp;
                    {menu[index].qty}
                    &nbsp;
                    {menu[index].qty<=0 ? null: (
                    <button
                        value={item.itemPrice} 
                        onClick={(e)=>{
                               setTotalPrice((totalPrice>0)&&totalPrice-Number(e.target.value));
                               var menu_1=[...menu];
                               menu_1[index].qty-=1;
                               setMenu(menu_1);
                            }}  
                            disabled={menu.qty<0}
                        className='btn btn-outline-secondary btn-sm'>
                            -
                    </button>
                    )}
                    </span>
                <hr/>
                </div>)
            }
        </Modal>

        <Modal
             isOpen={payment}
            // isOpen={false}
              style={customStyles3}
        >
            <div>
                <header className='paynow-div'> 
                    <span><button className='x' onClick={()=>{setPayment(false)}}>x</button></span>
                    <span><h2>Enter Details and Pay</h2></span> <br/>
                    <div>
                        <h1 className='paymentModelh1'>{rName}</h1>
                        <button
                        disabled={orderName!=undefined && orderMail!=undefined && orderNumber!=undefined && orderNumber.length==10? false:true}
                        className={orderName!=undefined && orderMail!=undefined && orderNumber!=undefined && orderNumber.length==10? 'amountbtn btn btn-success': 'amountbtn btn btn-danger'}
                        onClick={()=>{
                            makePayment();
                            setTimeout(() => {
                                setPayment(false);
                                setPlaceOrder(false);
                                setTotalPrice(0);
                            }, 0);
                        }}
                        >
                            &#8377;&nbsp;{totalPrice}
                        </button>
                    </div>
                </header>
            </div>

            <div className='inputs-final-container'>

                <div>
                    <input 
                        id='nameInput' 
                        className='inputBox-final' 
                        type='text' 
                        placeholder='Enter Name'
                        onChange={
                            (e)=>e.target.value=='' ? setOrderName(undefined):setOrderName(e.target.value)
                        }
                    />
                </div>
                
                <div>
                    <input 
                        id='mailInput' 
                        className='inputBox-final' 
                        type='email' 
                        placeholder='Enter Mail-Id'
                        onChange={
                            (e)=>e.target.value=='' ? setOrderMail(undefined):setOrderMail(e.target.value)
                        }
                    />
                </div>
            
                <div>
                    <input 
                        id='phoneInput' 
                        className='inputBox-final' 
                        type='number'
                        maxLength='10' 
                        pattern="[1-9]{1}[0-9]{9}" 
                        placeholder='Enter Mobile Number'
                        onChange={
                            (e)=>e.target.value=='' ? setOrderNumber(undefined):setOrderNumber(e.target.value)
                        }
                    />
                </div>
            </div>
        </Modal>
        {numberLimit()}
    </div>
  )
}
