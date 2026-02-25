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

  const handleDeleteGlossary = (glossaryId, glossaryTerm) => {
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
            text: deleteResult.message || 'Glossary deleted successfully',
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
            text: deleteResult.message || 'An error occurred while deleting the glossary',
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
    <>
      <GlobalLoader />
      <Header />
      <div className="wrapper">
        <Sidebar />
        <div className="content-wrapper">
          <div className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1 className="m-0">Glossaries</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item"><Link to="/dashboard">Home</Link></li>
                    <li className="breadcrumb-item active">Glossaries</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <section className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">Glossary Terms</h3>
                      <div className="card-tools">
                        <Link to="/add-glossary" className="btn btn-primary btn-sm">
                          <i className="fas fa-plus"></i> Add New Glossary
                        </Link>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by term, short form, or category..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>

                      {isLoading ? (
                        <div className="text-center py-4">
                          <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        </div>
                      ) : glossaries.length === 0 ? (
                        <div className="alert alert-info text-center py-4">
                          <i className="fas fa-info-circle me-2"></i>
                          No glossaries found. Click "Add New Glossary" to create one.
                        </div>
                      ) : filteredGlossaries.length === 0 ? (
                        <div className="alert alert-warning text-center py-4">
                          <i className="fas fa-search me-2"></i>
                          No matching glossaries found.
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-striped table-hover">
                            <thead className="table-light">
                              <tr>
                                <th width="5%">#</th>
                                <th width="20%">Term</th>
                                <th width="15%">Short Form</th>
                                <th width="20%">Category</th>
                                <th width="30%">Description</th>
                                <th width="10%" className="text-center">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredGlossaries.map((glossary, index) => (
                                <tr key={glossary.id || index}>
                                  <td>{index + 1}</td>
                                  <td>
                                    <strong>{glossary.term}</strong>
                                  </td>
                                  <td>
                                    <span className="badge badge-info">{glossary.short_form}</span>
                                  </td>
                                  <td>
                                    <span className="badge badge-secondary">{glossary.category}</span>
                                  </td>
                                  <td>
                                    <small>{glossary.description?.substring(0, 50)}...</small>
                                  </td>
                                  <td className="text-center">
                                    <div className="btn-group" role="group">
                                      <button
                                        onClick={() => handleDeleteGlossary(glossary.id, glossary.term)}
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
                        </div>
                      )}
                    </div>
                    <div className="card-footer">
                      <small className="text-muted">
                        Total: {glossaries.length} glossaries | Showing: {filteredGlossaries.length}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
