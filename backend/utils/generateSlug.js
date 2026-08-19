const generateSlug = (value) => value
	.toString()
	.toLowerCase()
	.trim()
	.replace(/[^a-z0-9 -]/g, '')
	.replace(/\s+/g, '-')
	.replace(/-+/g, '-');

export default generateSlug;
