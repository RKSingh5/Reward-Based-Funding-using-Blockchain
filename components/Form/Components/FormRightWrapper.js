import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';
import { FormState } from '../Form';

// const pinataApiKey = '1a1a6dffd1f097c09467';
// const pinataApiSecret = ' 95d283a5b349c171c99ec0ff8cb8596be698b75c4f5b0380d71f6d9c6b4e6945';

const pinataApiKey = '1d33d3def26081b2a2af';
const pinataApiSecret = 'ea166de05dbcf5d945706a50238978cbb084f71bb6a2a6cdb82cba9ed659b973';

const FormRightWrapper = () => {
  const Handler = useContext(FormState);

  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const uploadFiles = async (e) => {
    e.preventDefault();
    setUploadLoading(true);

    if (Handler.form.story !== '') {
      try {
        const formData = new FormData();
        formData.append('file', Handler.form.story);
        console.log(Handler.form.story);
        console.log(formData);
        const response = await axios.post(
          'https://api.pinata.cloud/pinning/pinJSONToIPFS',
          formData,
          {
            headers: {
              'Content-Type': 'application/json',
              pinata_api_key: pinataApiKey,
              pinata_secret_api_key: pinataApiSecret,
            },
          }
        );
        /*const response = await axios.post(
          'https://api.pinata.cloud/pinning/pinJSONToIPFS',
          {
            pinataMetadata: {
              name: 'Aman.txt', // Set the name for your text file
            },
            pinataContent: {
              text: Handler.form.story, // Your text data
            },
          },
          {
            headers: {
              'Content-Type': 'application/json', // Set Content-Type to JSON
              Authorization: 'Bearer pinataApiKey:pinataApiSecret', // Replace with your Pinata API credentials
            },
          }
        );*/

        if (response.status === 200) {
          Handler.setStoryUrl(response.data.IpfsHash);
        } else {
          toast.warn('Error Uploading Story');
        }
      } catch (error) {
        toast.warn('Error Uploading Story: ' + error.message);
      }
    }

    if (Handler.image !== null) {
      try {
        const formData = new FormData();
        formData.append('file', Handler.image);
        const response = await axios.post(
          'https://api.pinata.cloud/pinning/pinFileToIPFS',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              pinata_api_key: pinataApiKey,
              pinata_secret_api_key: pinataApiSecret,
            },
          }
        );

        if (response.status === 200) {
          Handler.setImageUrl(response.data.IpfsHash);
        } else {
          toast.warn('Error Uploading Image');
        }
      } catch (error) {
        toast.warn('Error Uploading Image: ' + error.message);
      }
    }

    setUploadLoading(false);
    setUploaded(true);
    Handler.setUploaded(true);
    toast.success('Files Uploaded Successfully');
  };

  return (
    <FormRight>
      <FormInput>
        {/* ... (same as in the previous code) */}
          
        <FormRow>
          <RowFirstInput>
            <label>Required Amount</label>
            <Input onChange={Handler.FormHandler} value={Handler.form.requiredAmount} name="requiredAmount" type={'number'} placeholder='Required Amount'></Input>
          </RowFirstInput>
          <RowSecondInput>
            <label>Choose Category</label>
            <Select onChange={Handler.FormHandler} value={Handler.form.category} name="category">
              <option>Project</option>
              <option>Health</option>
              <option>Animal</option>
            </Select>
          </RowSecondInput>
        </FormRow>
      </FormInput>
      {/* Image */}
      <FormInput>
        <label>Select Image</label>
        <Image alt="dapp" onChange={Handler.ImageHandler} type={'file'} accept='image/*'>
        </Image> 

      </FormInput>
        {uploadLoading ? (
          <Button disabled>
            <TailSpin color="#fff" height={20} />
          </Button>
        ) : uploaded ? (
          <Button disabled>Files Uploaded Successfully</Button>
        ) : (
          <Button onClick={uploadFiles}>Upload Files to IPFS</Button>
        )}
        <Button onClick={Handler.startCampaign}>Start Campaign</Button>
    </FormRight>
  );
};

// Styled components (same as in the previous code)

const FormRight = styled.div`
  width:45%;
`

const FormInput = styled.div`
  display:flex ;
  flex-direction:column;
  font-family:'poppins';
  margin-top:10px ;
`

const FormRow = styled.div`
  display: flex;
  justify-content:space-between;
  width:100% ;
`

const Input = styled.input`
  padding:15px;
  background-color:${(props) => props.theme.bgDiv} ;
  color:${(props) => props.theme.color} ;
  margin-top:4px;
  border:none ;
  border-radius:8px ;
  outline:none;
  font-size:large;
  width:100% ;
`

const RowFirstInput = styled.div`
  display:flex ;
  flex-direction:column ;
  width:45% ;
`

const RowSecondInput = styled.div`
  display:flex ;
  flex-direction:column ;
  width:45% ;
`

const Select = styled.select`
  padding:15px;
  background-color:${(props) => props.theme.bgDiv} ;
  color:${(props) => props.theme.color} ;
  margin-top:4px;
  border:none ;
  border-radius:8px ;
  outline:none;
  font-size:large;
  width:100% ;
`

const Image = styled.input`
  background-color:${(props) => props.theme.bgDiv} ;
  color:${(props) => props.theme.color} ;
  margin-top:4px;
  border:none ;
  border-radius:8px ;
  outline:none;
  font-size:large;
  width:100% ;

  &::-webkit-file-upload-button {
    padding: 15px ;
    background-color: ${(props) => props.theme.bgSubDiv} ;
    color: ${(props) => props.theme.color} ;
    outline:none ;
    border:none ;
    font-weight:bold ;
  }  
`

const Button = styled.button`
  display: flex;
  justify-content:center;
  width:100% ;
  padding:15px ;
  color:white ;
  background-color:#00b712 ;
  background-image:
      linear-gradient(180deg, #00b712 0%, #5aff15 80%) ;
  border:none;
  margin-top:30px ;
  cursor: pointer;
  font-weight:bold ;
  font-size:large ;
`

export default FormRightWrapper;