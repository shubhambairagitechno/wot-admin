import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getAllGlossaries, deleteGlossary } from '../api/glossary';
import { useAuth } from '../context/AuthContext';
import GlobalLoader from '../components/GlobalLoader';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function Glossaries() {
  const { token } = useAuth();
  const [glossaries, setGlossaries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGlossaries();
  }, []);

  const fetchGlossaries = async () => {
    setIsLoading(true);
    const result = await getAllGlossaries(token);
    
    if (result.success) {
      setGlossaries(result.data || []);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Glossaries',
        text: result.message || 'An error occurred while fetching glossaries',
      });
      setGlossaries([]);
    }
    setIsLoading(false);
  };

  const handleDelete = (glossaryId, glossaryTerm) => {
    Swal.fire({
      title: 'Delete Glossary',
      text: `Are you sure you want to delete "${glossaryTerm}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const deleteResult = await deleteGlossary(glossaryId, token);

        if (deleteResult.success) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted',
            text: deleteResult.message || 'Glossary term deleted successfully',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
          }).then(() => {
            fetchGlossaries();
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Failed to Delete',
            text: deleteResult.message || 'An error occurred while deleting the glossary term',
          });
        }
      }
    });
  };

  const filteredGlossaries = glossaries.filter(glossary =>
    glossary.term?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    glossary.short_form?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    glossary.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="content-page-header">
              <div>
                <h5>Glossaries</h5>
              </div>
              <div className="list-btn">
                <ul className="filter-list">
                  <li>
                    <Link className="btn btn-primary" to="/add-glossary">
                      <i className="fa fa-plus-circle me-2"></i>Add New Glossary
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table comman-shadow">
                <div className="card-body">
                  <div className="table-responsive">
                    <div className="search-box mb-3">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search glossaries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    {isLoading ? (
                      <GlobalLoader />
                    ) : filteredGlossaries.length === 0 ? (
                      <div className="text-center py-5">
                        <p className="text-muted">No glossary terms found</p>
                      </div>
                    ) : (
                      <table className="table table-hover comman-table datatable mb-0">
                        <thead>
                          <tr>
                            <th>Term</th>
                            <th>Short Form</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredGlossaries.map((glossary, index) => (
                            <tr key={glossary.id || index}>
                              <td>
                                <strong>{glossary.term}</strong>
                              </td>
                              <td>
                                <span className="badge bg-light text-dark">{glossary.short_form}</span>
                              </td>
                              <td>
                                <span className="badge bg-info text-white">{glossary.category}</span>
                              </td>
                              <td>
                                <div className="text-truncate" style={{ maxWidth: '300px' }} title={glossary.description}>
                                  {glossary.description}
                                </div>
                              </td>
                              <td>
                                <div className="btn-group" role="group">
                                  <Link 
                                    to={`/edit-glossary/${glossary.id}`}
                                    className="btn btn-sm btn-info"
                                    title="Edit"
                                  >
                                    <i className="fa fa-edit"></i>
                                  </Link>
                                  <button 
                                    onClick={() => handleDelete(glossary.id, glossary.term)}
                                    className="btn btn-sm btn-danger"
                                    title="Delete"
                                  >
                                    <i className="fa fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
