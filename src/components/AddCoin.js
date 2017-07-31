import React, { Component } from 'react';
import ImageUploader from 'react-images-uploader';
import 'react-images-uploader/styles.css';
import 'react-images-uploader/font.css';

class AddCoin extends Component {
   constructor(props) {
       super(props);
       this.saveCoin = this.saveCoin.bind(this);
       this.changeDescription = this.changeDescription.bind(this);
   }
   changeDescription(event) {
       this.setState({'description':event.target.value});
   }

   saveCoin(event) {
       
   }

   render() {
       return (
               <form>
               <label>
               description (goes on blockchain):
               <input type="text" name="description" onChange={changeDescription} />
               </label>
               <label>
               </label>
               <ImagesUploader url="http://localhost:9090/multiple"
                               optimisticPreview
                               onLoadEnd={ (err) => {
                                   if (err) {
                                       console.error(err);
                                   }
                               }}
               </label>
               <label>
               Storage Fee: <input type="text" name="storageFee"/>
               </label>

               <label>
               Late Fee: <input type="text" name="lateFee"/>  (in Wei)
               </label>
               
               <button onClick={saveCoin}>Save coin</button>
               </form>
              );
   }
}

export default AddCoin
