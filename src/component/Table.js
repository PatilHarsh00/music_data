import React,{useEffect, useState} from 'react'
import axios from 'axios'

export default function Table() {
    const [data, setData] = useState([]);
    const [sortConfig, setSortConfig] = useState({
            key: 'index',
            direction: "ascending"
        });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(()=>{
        async function fetchItems() {
            try {
                const response = await axios.get('/playlist.json');
                const data = response.data;
                const formattedData = Object.keys(data.id).map((key,index)=>({
                    index : index,
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

    },[])

    // Download CSV
    const handleDownloadCSV= () => {
        const csvData = convertToCSV(data);
        const blob = new Blob([csvData], {type: 'text/csv'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'table_data.csv';
        link.click();
    }

    const convertToCSV = (data) => {
        const header = Object.keys(data[0]).join(',');
        const rows = data.map((item) => Object.values(item).join(','));
        return `${header}\n${rows.join('\n')}`;
    }

    // To handle the sort functionality
    const handleSort = (key) => {
        
        let direction = 'ascending';
        if(sortConfig.key === key && sortConfig.direction === 'ascending'){
            direction = 'descending';
        }
        setSortConfig({key, direction});
    }

    // Filter the data according to the search input
    const filteredData = data.filter((item) => {
        return (
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            false 
        );
      });


    // Sort the filtered data if any 
    const sortedData = [...filteredData].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        else if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
      
        return 0;
      });
      
    // Pagination
    const handlePageChange = (page) =>{
        setCurrentPage(page);
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

    // const pageNumbers = [];
    // for(let i=1 ; i<= Math.ceil(sortedData.length/itemsPerPage) ; i++){
    //     pageNumbers.push(i);
    // }

    const Pagination = () => {
        const pageNumbers = Array.from({ length: Math.ceil(sortedData.length / itemsPerPage) }, (_, index) => index + 1);
      
        return (
          <div className='pagination'>
            {currentPage > 1 && (
              <span onClick={() => handlePageChange(currentPage - 1)}>&lt; Prev</span>
            )}
      
            {pageNumbers.length > 1 && (
              <span onClick={() => handlePageChange(currentPage)} className='active'>{currentPage}</span>
            )}
      
            {currentPage < pageNumbers.length && (
              <span onClick={() => handlePageChange(currentPage + 1)}>Next &gt;</span>
            )}
          </div>
        );
      };

    return(
        <div className='tableContainer'>
            <input
                type='text'
                placeholder='Search Title'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <table>
                <thead>
                    <tr>
                        <th onClick={()=>{handleSort('index')}}>index</th>
                        <th onClick={()=>{handleSort('id')}}>id</th>
                        <th onClick={()=>{handleSort('title')}}>title</th>
                        <th onClick={()=>{handleSort('danceability')}}>danceability</th>
                        <th onClick={()=>{handleSort('energy')}}>energy</th>
                        <th onClick={()=>{handleSort('mode')}}>mode</th>
                        <th onClick={()=>{handleSort('acousticness')}}>acousticness</th>
                        <th onClick={()=>{handleSort('tempo')}}>tempo</th>
                        <th onClick={()=>{handleSort('duration_ms')}}>duration_ms</th>
                        <th onClick={()=>{handleSort('num_sections')}}>num_sections</th>
                        <th onClick={()=>{handleSort('num_segments')}}>num_segments</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item)=>(
                        <tr key={item.index}>
                            <td>{item.index}</td>
                            <td>{item.id}</td>
                            <td>{item.title}</td>
                            <td>{item.danceability}</td>
                            <td>{item.energy}</td>
                            <td>{item.mode}</td>
                            <td>{item.acousticness}</td>
                            <td>{item.tempo}</td>
                            <td>{item.duration_ms}</td>
                            <td>{item.num_sections}</td>
                            <td>{item.num_segments}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination />
            <button onClick={handleDownloadCSV}>Download CSV</button>
        </div>
    )
}