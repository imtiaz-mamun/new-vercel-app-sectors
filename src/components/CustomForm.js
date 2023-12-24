import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getSession } from '../sessionUtils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../customReactToastify.css';
import Swal from 'sweetalert2';

const updateDataFun = async (id, name, sectors, agree) => {
	Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to UPDATE the data?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel',
    }).then(async(result) => {
      if (result.isConfirmed) {
		try {
			const response = await fetch('/api/updateFormData', {
				method: 'POST',
				headers: {
				  'Content-Type': 'application/json',
				},
				body: JSON.stringify({ id, name, sectors, agree }),
			});
			if (!response.ok) {
				throw new Error('Failed to update data to the server');
			}
			const data = await response.json();
		      	toast.info('Data Update Succesfully!!!');
				alert('Data Update Succesfully!!!\nFor New Entry Please Refresh This Page');
		} catch (error) {
			console.error(error);
			alert('Failed to update data');
		}
        Swal.fire('Updated!', 'Your data has been updated.', 'success');
      }
    });
}
const CustomForm = ({ onSubmit }) => {
  	const [sectors, setSectors] = useState([]);
  	const handleSubmit = async (event) => {
	    event.preventDefault();
	    const name = event.target.elements.name.value;
	    const sectors = Array.from(event.target.elements.sectors.selectedOptions).map((option) => option.value);
	    const agree = event.target.elements.agree.checked;
	    if (!name || sectors.length === 0 || !agree) {
	      alert('All fields are mandatory');
	      return;
	    }
	    const sessionData =  getSession();
	    if(!sessionData){
	    	try {
		      const response = await fetch('/api/saveFormData', {
		        method: 'POST',
		        headers: {
		          'Content-Type': 'application/json',
		        },
		        body: JSON.stringify({ name, sectors, agree }),
		      });
		      if (!response.ok) {
		        throw new Error('Failed to save data to the server');
		      }
		      const data = await response.json();
		      toast.success('Data Saved Succesfully!!!');
		      alert('Data Saved Succesfully!!!\n\nUntil this browser tab is refreshed or closed you can update this data\n\nFor New Entry Please Refresh This Page');
		      onSubmit(data);
		      // Redirect to the ViewData page after form submission
		      // navigate('/view-data'); // Change this line
		    } catch (error) {
		      console.error(error);
		      alert('Failed to save data');
		    }
	    }
	    else{
	    	const id = sessionData.id;
	    	updateDataFun(id, name, sectors, agree);
	    }
  	};
	useEffect(() => {
		const fetchData = async () => {
		  try {
		    const response = await fetch('/api/sectors', {
		      method: 'GET',
		      headers: {
		        'Content-Type': 'application/json',
		      },
		    });

		    if (!response.ok) {
		      throw new Error(`HTTP error! Status: ${response.status}`);
		    }
		    const data = await response.text(); // Get the raw response as text
		    if (data.trim() !== '') {
			setSectors(JSON.parse(data));
		    } else {
			console.warn('Empty response received');
		    }
		    // console.log(response.json());
		    // const data = await response.json();
		    // setSectors(data.sectors);
		  } catch (error) {
			console.error('Error fetching data:', error.message);
		  }
		};

		fetchData();
	}, []);

	return (
		<div className="container mt-5 blue-bg">
		  <div className="row justify-content-center">
		    <div className="col-md-6">
		      <form onSubmit={handleSubmit}>
		        <div className="mb-3">
		          <label htmlFor="name" className="form-label">Name:</label>
		          <input type="text" className="form-control" id="name" name="name" />
		        </div>

		        <div className="mb-3">
		          <label htmlFor="sectors" className="form-label">Sectors:</label>
		          <select multiple className="form-select" id="sectors" name="sectors">
		          	{sectors.map((sector) => (
			        	<option key={sector.id} value={sector.name}>{sector.name}</option>
			        ))}
		          </select>
		        </div>

		        <div className="mb-3 form-check">
		          <input type="checkbox" className="form-check-input" id="agree" name="agree" />
		          <label className="form-check-label" htmlFor="agree">Agree to terms</label>
		        </div>

		        <div className="mb-3">
		          <button type="submit" className="btn btn-primary">Save</button>
		        </div>
		        <div className="mb-3">
		          <a href="/view-data" target="_blank" className="back-btn">View All Saved Data</a>
		        </div>
		      </form>
		    </div>
		  </div>
		  <ToastContainer />
		</div>
	);
};
export default CustomForm;
   
