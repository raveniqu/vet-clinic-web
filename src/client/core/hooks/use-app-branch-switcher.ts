import { BuildingComplex, Store } from "lucide-react";
import { useState } from "react";

const MOCK_SELECT_ITEMS = [
	{
		label: "ขอนแก่น (สำนักงานใหญ่)",
		value: "jb8oit6kz4rjy6vb4btboi0i",
		icon: BuildingComplex,
	},
	{
		label: "ทองหล่อ-สุขุมวิท 71",
		value: "xvy0hr8jdscpjazjao0el8wb",
		icon: Store,
	},
	{
		label: "บางนา-ตราด กม.25",
		value: "otgdc6z9gk7ltdyc5o5igfoc",
		icon: Store,
	},
];

export function useBranchSwitcher() {
	const [selectedBranch, setSelectedBranch] = useState(
		MOCK_SELECT_ITEMS[0].value,
	);
	const selectedItem = MOCK_SELECT_ITEMS.find(
		(item) => item.value === selectedBranch,
	);

	const handdleBranhChange = (value: string | null) => {
		if (value) setSelectedBranch(value);
	};
	return {
		selectItems: MOCK_SELECT_ITEMS,
		selectedBranch,
		selectedItem,
		onBranchChange: handdleBranhChange,
	};
}
