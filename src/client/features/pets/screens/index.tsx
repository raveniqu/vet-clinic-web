import {
	AppDashboardActions,
	AppDashboardContent,
	AppDashboardDescription,
	AppDashboardHeader,
	AppDashboardRoot,
	AppDashboardTitle,
} from "#/client/shared/components/app-dashboard";
import { PetsSummary } from "../components/dashboard/pets-summary";
import { AddNewPetTrigger } from "../components/form/add-new-pet-trigger";
import { PetFormSheet } from "../components/form/pet-form-sheet";
import { PetOwnerCreateModal } from "../components/form/pet-owner-create-modal";
import { PetFormProvider } from "../contexts/pet-form.context";

export function PetsScreen() {
	return (
		<PetFormProvider>
			<AppDashboardRoot>
				<AppDashboardHeader>
					<AppDashboardTitle>ทะเบียนสัตว์เลี้ยง</AppDashboardTitle>
					<AppDashboardDescription>
						รายการสัตว์เลี้ยงทั้งหมดในระบบ ดูประวัติการรักษา และจัดการข้อมูลสัตว์เลี้ยง
					</AppDashboardDescription>
					<AppDashboardActions>
						<AddNewPetTrigger />
					</AppDashboardActions>
				</AppDashboardHeader>
				<AppDashboardContent>
					<PetsSummary />
				</AppDashboardContent>
			</AppDashboardRoot>
			<PetFormSheet />
			<PetOwnerCreateModal />
		</PetFormProvider>
	);
}
