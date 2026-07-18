import { useEffect, useState } from "react";
import { FiHome, FiBriefcase, FiMapPin, FiEdit2, FiStar, FiTrash2, FiPlus } from "react-icons/fi";
import Navbar from "../components/Navbar/Navbar";
import AddressFormModal from "../components/AddressFormModal/AddressFormModal";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../services/addressService";
import { toast } from "react-toastify";
import "./Addresses.css";

const TYPE_ICON = {
  Home: <FiHome />,
  Work: <FiBriefcase />,
  Other: <FiMapPin />,
};

function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const res = await getAddresses();
      setAddresses(res.addresses || []);
    } catch {
      toast.error("Unable to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setShowModal(true);
  };

  const openEdit = (address) => {
    setEditing(address);
    setShowModal(true);
  };

  const handleSave = async (form) => {
    try {
      if (editing) {
        await updateAddress(editing.id, form);
        toast.success("Address updated");
      } else {
        await addAddress(form);
        toast.success("Address added");
      }
      setShowModal(false);
      setEditing(null);
      loadAddresses();
    } catch {
      toast.error("Operation failed");
    }
  };

  const removeAddress = async () => {
    if (!confirmDelete) return;
    try {
      await deleteAddress(confirmDelete.id);
      toast.success("Address deleted");
      loadAddresses();
    } catch {
      toast.error("Delete failed");
    } finally {
      setConfirmDelete(null);
    }
  };

  const makeDefault = async (id) => {
    try {
      await setDefaultAddress(id);
      toast.success("Default address updated");
      loadAddresses();
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="address-page">
        <div className="address-header">
          <h1>My Addresses</h1>
          <button className="add-btn" onClick={openAdd}>
            <FiPlus /> Add Address
          </button>
        </div>

        {loading ? (
          <p className="address-status">Loading addresses...</p>
        ) : addresses.length === 0 ? (
          <div className="address-empty">
            <FiMapPin size={36} />
            <p>No saved addresses yet.</p>
            <button className="add-btn" onClick={openAdd}>
              <FiPlus /> Add your first address
            </button>
          </div>
        ) : (
          <div className="address-grid">
            {addresses.map((a) => (
              <div className={`address-card ${a.is_default ? "is-default" : ""}`} key={a.id}>
                <div className="address-card-top">
                  <span className="address-type">
                    {TYPE_ICON[a.address_type] || <FiMapPin />}
                    {a.address_type}
                  </span>
                  {!!a.is_default && <span className="default-badge">DEFAULT</span>}
                </div>

                <p className="address-name">{a.full_name}</p>
                <p className="address-phone">{a.phone}</p>
                <p className="address-line">{a.address_line}</p>
                <p className="address-line">
                  {a.city}{a.state ? `, ${a.state}` : ""} - {a.pincode}
                </p>

                <div className="address-actions">
                  <button onClick={() => openEdit(a)}>
                    <FiEdit2 /> Edit
                  </button>

                  {!a.is_default && (
                    <button onClick={() => makeDefault(a.id)}>
                      <FiStar /> Set Default
                    </button>
                  )}

                  <button className="danger" onClick={() => setConfirmDelete(a)}>
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <AddressFormModal
          initialData={editing}
          onClose={() => {
            setShowModal(false);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}

      {confirmDelete && (
        <div className="address-confirm-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="address-confirm-box" onClick={(e) => e.stopPropagation()}>
            <FiTrash2 size={22} className="address-confirm-icon" />
            <h3>Delete this address?</h3>
            <p>
              {confirmDelete.address_line}, {confirmDelete.city} will be removed permanently.
            </p>
            <div className="address-confirm-actions">
              <button onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="danger" onClick={removeAddress}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Addresses;
