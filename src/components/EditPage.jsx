import React from "react";
import styled from "styled-components";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useState } from "react";


const Container = styled.div`
  border: 2px solid teal;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  width: 40%;
  justify-content: center;
  margin: auto;
  background: white;
  margin-top: 150px;
  height: 40vh;
  padding: 50px;
`;
const CloseBox = styled.div`
  text-align: right;

  padding-right: 10px;
`;
const Span = styled.span`
  font-size: 32px;
  cursor:pointer
`;

const Header = styled.div`
  font-size: 24px;
  text-align: center;
  margin-bottom: 32px;
`;
const InputBox = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;
const Input = styled.input``;
const ButtonBox = styled.div`
  //  border:2px solid red;
  display: flex;
  justify-content: center;

`;

const EditPage = ({ setEditpageOpen, editData, rows, setRows }) => {
  const [ename, setEname] = useState(editData[0].name);
  const [eemail, setEemail] = useState(editData[0].email);
  const [erole, setErole] = useState(editData[0].role);

  const handlePopup = (e) => {
    setEditpageOpen(false);
    e.stopPropagation();
  };
  const handleSubmit = () => {
  
    let arr2=[]
    
    // eslint-disable-next-line
    rows.map(({ id }) => {
      if (id === editData[0].id) {
         let ob = {
            id,
          name: ename,
          email: eemail,
          role: erole,
        };
        arr2.push(ob)
        console.log(arr2);
      }

    });
    // console.log(obj)
   const ans = rows.map(obj => arr2.find(o => o.id === obj.id) || obj);
   setRows(ans)
   setEditpageOpen(false);
  };

  return (
    <Container>
      <CloseBox>
        <Span onClick={(e) => handlePopup(e)}>
          <HighlightOffIcon />
        </Span>
      </CloseBox>
      <Header>Edit Data</Header>
      {editData.map((data) => (
        <div key={data.id}>
          <InputBox>
            <label htmlFor="name">Name : </label>
            <Input
              defaultValue={data.name}
              name="name"
              onChange={(e) => setEname(e.target.value)}
            ></Input>
          </InputBox>
          <br />
          <InputBox>
            <label htmlFor="email">Email : </label>
            <Input
              defaultValue={data.email}
              name="email"
              onChange={(e) => setEemail(e.target.value)}
            ></Input>
          </InputBox>
          <br />
          <InputBox>
            <label htmlFor="role">Role : </label>
            <Input
              defaultValue={data.role}
              name="role"
              onChange={(e) => setErole(e.target.value)}
            ></Input>
          </InputBox>
          <br />
          <ButtonBox>
            <button onClick={handleSubmit} style={{ cursor:"pointer"}}>SUBMIT</button>
          </ButtonBox>
        </div>
      ))}
    </Container>
  );
};

export default EditPage;
