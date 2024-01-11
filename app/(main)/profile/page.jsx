import React from "react";

import ProfileForm from "../../components/ProfileForm";

const Page = async () => {
	//const session = await getServerSession(authOptions);
	//if (!session) redirect("/signin?callbackUrl=/profile");
	return (
		<div>
			<ProfileForm />
		</div>
	);
};

export default Page;
