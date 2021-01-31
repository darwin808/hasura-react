import React, { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";

function App() {
  const getQuery = gql`
    query MyQuery {
      hasura1 {
        name
        id
      }
    }
  `;

  const add_Data = gql`
    mutation MyMutation($name: String) {
      insert_hasura1(objects: { name: $name }) {
        returning {
          name
          id
        }
      }
    }
  `;

  const del_data = gql`
    mutation MyMutation($id: uuid) {
      delete_hasura1(where: { id: { _eq: $id } }) {
        returning {
          id
          name
        }
      }
    }
  `;

  const update_data = gql`
    mutation MyMutation($idholder: uuid, $edit: String) {
      update_hasura1(where: { id: { _eq: $idholder } }, _set: { name: $edit }) {
        returning {
          id
          name
        }
      }
    }
  `;

  const { data, loading } = useQuery(getQuery);
  const [addData] = useMutation(add_Data);
  const [delData] = useMutation(del_data);
  const [updateData] = useMutation(update_data);
  const [name, setname] = useState("");
  const [edit, setedit] = useState("");
  const [modal, setmodal] = useState(false);
  const [idholder, setidholder] = useState(0);

  const handlesubmit = (e) => {
    e.preventDefault();
    addData({ variables: { name } });
  };

  const deleteDataOnclick = (id) => {
    delData({ variables: { id } });
  };

  const openmodal = (id) => {
    setidholder(id);
    setmodal(true);
  };

  const handleedit = (e) => {
    e.preventDefault();
    updateData({ variables: { idholder, edit } });
  };
  return (
    <div className="App">
      <form action="submit" onSubmit={handlesubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setname(e.target.value);
          }}
        />
      </form>

      {modal && (
        <form action="submit" onSubmit={handleedit}>
          <input
            type="text"
            value={edit}
            onChange={(e) => {
              setedit(e.target.value);
            }}
          />
        </form>
      )}

      {loading ? (
        <h1>Please wait....</h1>
      ) : (
        <div>
          {data.hasura1.map((e) => (
            <div key={e.id}>
              {e.name}{" "}
              <button
                onClick={() => {
                  deleteDataOnclick(e.id);
                }}>
                delete
              </button>
              <button
                onClick={() => {
                  openmodal(e.id);
                }}>
                edit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
