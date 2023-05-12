import React, { Component } from 'react'
import MealType from './MealType'
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
// import AiOutlineSearch from 'react-icons'

export default class Wallpaper extends Component {

    constructor(){
        super();
        this.state={
            locations:[],
            restaurants:[],
            rName:''
        }
    }

    componentDidMount(){
        fetch('https://backend-node-zomato-dharineesh-gg.onrender.com/zomato/locations',{method:'GET'})
        .then((response)=>response.json())
        .then((data)=>/*console.log(data)*/ this.setState({locations:data.data}) )
        
    }

    fetchRestaurants=(event)=>{
        fetch(`https://backend-node-zomato-dharineesh-gg.onrender.com/zomato/restaurants/${event.target.value}`,{method:'GET'})
        .then((response)=>response.json())
        .then((data)=>{console.log(data);this.setState({restaurants:data.data}) })
    }

    setRname=(e)=>{
        this.setState({rName:e.target.value});
        console.log(e.target.value);
    }

  render() {
    let DropDownList=this.state.locations.length && this.state.locations.map((item)=><option key={item.name} value={item.city_id} >{item.name}</option>);


    return (
        <div>
            <img src={'https://png.pngtree.com/background/20210710/original/pngtree-hot-pot-gourmet-food-poster-picture-image_1025936.jpg'} width='100%' height='450' />

            <div className="logo">
                <p className="e">z!</p>
            </div>
            <div className="headings">
                <b>Find the best restaurants, cafes, bars </b>
            </div>
            <div className="locationSelector">
                <div id='cityNoteBooks'>
                    <select className="locationDropdown" onChange={this.fetchRestaurants}>
                    <option value="0" disabled selected>Select</option>
                    {DropDownList}
                    </select>
                </div>
                <div id="notebooks" >
                    <select className="restaurantsinput"  onChange={this.setRname}>
                        <option value="0" disabled selected>Select</option>
                        {this.state.restaurants.map((item,index)=><option key={item.name} value={item.name}>{item.name}</option>)}
                    </select>
                {this.state.rName && <div className='searchIcon-div'><Link to={`/details/${this.state.rName}`}> <SearchIcon className='search-Icon'/> </Link></div>}
                </div>
                {/* {SearchIcon} */}
            
            </div>
        </div >
    )
  }
}
