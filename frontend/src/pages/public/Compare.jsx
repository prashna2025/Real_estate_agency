import React from 'react';
import { Link } from 'react-router-dom';
import { X, MapPin } from 'lucide-react';
import { useCompare } from '../../context/CompareContent';
import { getImageUrl } from '../../services/api';

const formatPrice = (price) => new Intl.NumberFormat('en-NP', {
	style: 'currency', currency: 'NPR', maximumFractionDigits: 0,
}).format(price || 0);

const Compare = () => {
	const { compareItems, removeFromCompare } = useCompare();

	if (compareItems.length === 0) {
		return (
			<div className="max-w-4xl mx-auto px-6 py-24 text-center">
				<h1 className="font-serif text-4xl mb-4">Compare properties</h1>
				<p className="text-charcoal-muted mb-8">Select properties from the collection to compare their key details side by side.</p>
				<Link to="/properties" className="inline-flex bg-terracotta text-white px-6 py-3 rounded-sm hover:bg-terracotta-hover transition-colors">Browse properties</Link>
			</div>
		);
	}

	const rows = [
		['Price', (property) => formatPrice(property.price)],
		['Purpose', (property) => property.type || 'Not specified'],
		['Category', (property) => property.category || 'Not specified'],
		['Location', (property) => `${property.location || ''}${property.city ? `, ${property.city}` : ''}`],
		['Bedrooms', (property) => property.bedrooms ?? 'Not specified'],
		['Bathrooms', (property) => property.bathrooms ?? 'Not specified'],
		['Area', (property) => property.area ? `${property.area} Sq. Ft` : 'Not specified'],
		['Status', (property) => property.status || 'Not specified'],
	];

	return (
		<div className="max-w-7xl mx-auto px-6 py-12">
			<div className="flex flex-wrap items-end justify-between gap-4 mb-8">
				<div><h1 className="font-serif text-4xl mb-2">Compare properties</h1><p className="text-charcoal-muted">Review up to four listings side by side.</p></div>
				<Link to="/properties" className="text-terracotta font-medium hover:underline">Add another property</Link>
			</div>
			<div className="overflow-x-auto border border-stone bg-white rounded-sm">
				<table className="w-full min-w-[720px] border-collapse">
					<thead><tr className="border-b border-stone"><th className="w-36 p-4 text-left text-sm text-charcoal-muted font-medium">Details</th>{compareItems.map((property) => <th key={property._id} className="p-4 text-left align-top min-w-[180px]"><div className="relative"><button type="button" onClick={() => removeFromCompare(property._id)} aria-label={`Remove ${property.title}`} className="absolute right-0 top-0 text-charcoal-muted hover:text-terracotta"><X size={18} /></button><img src={getImageUrl(property.images?.[0])} alt="" className="w-full aspect-[4/3] object-cover mb-3" /><Link to={`/property/${property.slug}`} className="font-serif text-lg hover:text-terracotta">{property.title}</Link><p className="flex items-center gap-1 text-xs text-charcoal-muted mt-2"><MapPin size={13} />{property.city}</p></div></th>)}</tr></thead>
					<tbody>{rows.map(([label, value]) => <tr key={label} className="border-b border-stone last:border-0"><th className="p-4 text-left text-sm font-medium text-charcoal-muted">{label}</th>{compareItems.map((property) => <td key={`${property._id}-${label}`} className="p-4 text-sm text-charcoal">{value(property)}</td>)}</tr>)}</tbody>
				</table>
			</div>
		</div>
	);
};

export default Compare;
