import { useEffect } from 'react';

export default function useDebounced(action: () => void, dependencies: unknown[], delay = 500) {
	useEffect(() => {
		const debounceId = setTimeout(() => action(), delay);
		return () => clearTimeout(debounceId);
	}, dependencies);
}
