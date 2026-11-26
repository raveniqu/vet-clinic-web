import {
	Calendar,
	CircleUserRound,
	PawPrint,
	Receipt,
	Undo2,
} from "lucide-react";
import {
	AppDashboardContent,
	AppDashboardFooter,
	AppDashboardRoot,
} from "#/client/shared/components/app-dashboard";
import { AppButtonLink } from "#/client/shared/components/app-link";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "#/client/shared/shadcn/components/ui/tabs";
import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";
import { OwnerDeleteAlertDialog } from "../components/dashboard/owner-delete-alert-dialog";
import { OwnerAppointments } from "../components/details/owner-appointments";
import { OwnerBillingRecords } from "../components/details/owner-billing-records";
import { OwnerDetailsHeader } from "../components/details/owner-details-header";
import { OwnerGeneralInfo } from "../components/details/owner-general-info";
import { OwnerPetsOwned } from "../components/details/owner-pets-owned";
import { OwnerFormSheet } from "../components/form/owner-form-sheet";
import { OwnerDeleteProvider } from "../contexts/owner-delete.context";
import { OwnerFormProvider } from "../contexts/owner-form.context";

export function OwnerDetailsScreen() {
	const isMobile = useIsMobile();

	return (
		<OwnerFormProvider>
			<OwnerDeleteProvider>
				<AppDashboardRoot className="mx-auto max-w-7xl pt-0!">
					<OwnerDetailsHeader />
					<AppDashboardContent>
						<Tabs defaultValue="general-info" className="col-span-full">
							<TabsList
								variant="line"
								className="w-full overflow-x-auto **:after:bg-primary **:aria-selected:text-primary md:w-fit"
							>
								<TabsTrigger value="general-info">
									<CircleUserRound aria-hidden="true" />
									<span>ข้อมูลทั่วไป</span>
								</TabsTrigger>
								<TabsTrigger value="pets-owned">
									<PawPrint aria-hidden="true" />
									<span>สัตว์เลี้ยง</span>
								</TabsTrigger>
								<TabsTrigger value="appointments">
									<Calendar aria-hidden="true" />
									<span>นัดหมาย</span>
								</TabsTrigger>
								<TabsTrigger value="billing-records">
									<Receipt aria-hidden="true" />
									<span>การชำระเงิน</span>
								</TabsTrigger>
							</TabsList>
							<TabsContent value="general-info">
								<OwnerGeneralInfo />
							</TabsContent>
							<TabsContent value="pets-owned">
								<OwnerPetsOwned />
							</TabsContent>
							<TabsContent value="appointments">
								<OwnerAppointments />
							</TabsContent>
							<TabsContent value="billing-records">
								<OwnerBillingRecords />
							</TabsContent>
						</Tabs>
					</AppDashboardContent>
					{isMobile ? (
						<AppDashboardFooter className="mt-auto">
							<AppButtonLink to="/owners" size="sm" variant="outline">
								<Undo2 aria-hidden="true" />
								<span>กลับไปหน้ารายชื่อเจ้าของ</span>
							</AppButtonLink>
						</AppDashboardFooter>
					) : null}
				</AppDashboardRoot>
				<OwnerFormSheet />
				<OwnerDeleteAlertDialog />
			</OwnerDeleteProvider>
		</OwnerFormProvider>
	);
}
