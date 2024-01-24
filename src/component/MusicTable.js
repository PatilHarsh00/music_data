import { DataGrid } from '@mui/x-data-grid';
import React,{useEffect, useState} from 'react'
import axios from 'axios'

const columns = [
  { field: 'index', headerName: 'Index', width: 70 },
  { field: 'id', headerName: 'ID', width: 220 },
  { field: 'title', headerName: 'Title', width: 130 },
  { field: 'danceability', headerName: 'Danceability', width: 130 },
  { field: 'energy', headerName: 'Energy', width: 130 },
  { field: 'mode', headerName: 'Mode', width: 90 },
  { field: 'acousticness', headerName: 'Acousticness', width: 130 },
  { field: 'tempo', headerName: 'Tempo', width: 130 },
  { field: 'duration_ms', headerName: 'duration_ms', width: 130 },
  { field: 'num_sections', headerName: 'num_sections', width: 130 },
  { field: 'num_segments', headerName: 'num_segments', width: 130 },
  
];

export default function DataTable() {
  const[data, setData] = useState([]);
  const[searchTerm, setSearchTerm] = useState('')

  useEffect(()=>{
    async function fetchItems(){
      try {
        const response = await axios.get('/playlist.json');
                const data = response.data;
                const formattedData = Object.keys(data.id).map((key,index)=>({
                    index : index+1,
                    id: data.id[key],
                    title : data.title[key],
                    danceability : data.danceability[key],
                    energy : data.energy[key],
                    mode : data.mode[key],
                    acousticness : data.acousticness[key],
                    tempo : data.tempo[key],
                    duration_ms : data.duration_ms[key],
                    num_sections : data.num_sections[key],
                    num_segments : data.num_segments[key]
                }))
                setData(formattedData);
      } catch (error) {
        console.log(error)
      }
    }

    fetchItems();
  },[]);

  // Fuction used to search the title in the data
  const searchedData = data.filter((item) =>{
    return(
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || false
    );
  })

  // Function to create CSV file to download
  const handleDownloadCSV = () => {
    const csvData = convertToCSV(data);
    const blob = new Blob ([csvData], {type : 'text/csv'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'table_data.csv';
    link.click();
  }

  //Function to convert the data to csv format
  const convertToCSV = (data) => {
    const header = Object.keys(data[0]).join(',');
    const rows = data.map((item) => Object.values(item).join(','));
    return `${header}\n${rows.join('\n')}`;
  }

  return (
    <div className='tableContainer'>
      <div className='tableHeader'>
        <input
          type='text'
          placeholder='Search Title'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='searchContainer' 
        />
        <button onClick={handleDownloadCSV}>Download CSV</button>
      </div>
      <DataGrid
        rows={searchedData}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 20]}
      />
    </div>
  );
}
