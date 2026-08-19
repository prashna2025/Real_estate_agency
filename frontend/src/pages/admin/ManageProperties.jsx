import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw } from 'lucide-react';
import { api, getImageUrl } from '../../services/api';
import Button from '../../components/common/Button';

const ManageProperties = () => {
	const [properties, setProperties] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	const fetchProperties = async () => {
		setLoading(true);
		setError('');
		try {
			const { data } = await api.get('/properties?limit=100');
			setProperties(data.properties || []);
		} catch (requestError) {
			setError(requestError.response?.data?.message || 'Could not load properties.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => { fetchProperties(); }, []);

	const removeProperty = async (id) => {
		if (!window.confirm('Delete this property?')) return;
		await api.delete(`/properties/${id}`);
		setProperties((current) => current.filter((property) => property._id !== id));
	};

	return (
		<div>
			<div className="flex flex-wrap items-center justify-between gap-4 mb-8">
				<div>
					<h1 className="font-serif text-3xl">Manage Properties</h1>
					<p className="text-charcoal-muted text-sm mt-1">{properties.length} listings</p>
				</div>
				<div className="flex gap-3">
					<Button type="button" variant="ghost" onClick={fetchProperties} disabled={loading}>
						<RefreshCw size={16} className="mr-2" /> Refresh
					</Button>
					<Button type="button" disabled>
						<Plus size={16} className="mr-2" /> Add Property
					</Button>
				</div>
			</div>

			{error && <p className="border border-red-200 bg-red-50 p-4 text-sm text-red-700 mb-6">{error}</p>}
			{loading ? <p className="text-charcoal-muted">Loading properties...</p> : (
				<div className="overflow-x-auto bg-white border border-stone rounded-sm">
					<table className="w-full text-left text-sm">
						<thead className="border-b border-stone bg-cream-dark/40">
							<tr><th className="p-4">Property</th><th className="p-4">Location</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr>
						</thead>
						<tbody className="divide-y divide-stone">
							{properties.map((property) => (
								<tr key={property._id}>
									<td className="p-4 flex items-center gap-3 min-w-64"><img src={getImageUrl(property.images?.[0])} alt="" className="w-14 h-12 object-cover rounded-sm" /><span className="font-medium">{property.title}</span></td>
									<td className="p-4 text-charcoal-muted">{property.city}, {property.location}</td>
									<td className="p-4">{property.status}</td>
									<td className="p-4"><div className="flex gap-3"><Link className="text-terracotta" to={`/property/${property.slug}`}>View</Link><button className="text-red-600" onClick={() => removeProperty(property._id)}>Delete</button></div></td>
								</tr>
							))}
						</tbody>
					</table>
					{!properties.length && <p className="p-8 text-center text-charcoal-muted">No properties yet.</p>}
				</div>
			)}
		</div>
	);
};

export default ManageProperties;
