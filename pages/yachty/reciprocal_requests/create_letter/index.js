import LetterOfReciprocity from "@/components/LetterOfReciprocity";
import NavBar from "@/components/NavBar";
import { Divider, Stack } from "@mui/material";
import { useRouter } from "next/router";

const CreateLetterOfReciprocity = () => {
    const router = useRouter();
    const reqId = router.query.reqid;

    return (
      <>
        <NavBar />
        <div style={{padding: 70}}>
          <Stack spacing={10} alignItems="center">
            <LetterOfReciprocity reqId={reqId} />
          </Stack>
        </div>
      </>
    )
  };

  export default CreateLetterOfReciprocity;