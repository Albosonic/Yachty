import LetterOfReciprocity from "@/components/LetterOfReciprocity";
import { Divider, Stack } from "@mui/material";
import { useRouter } from "next/router";

const CreateLetterOfReciprocity = () => {
    const router = useRouter()
    const reqId = router.query.reqid;

    return (
      <>
        <Stack spacing={2} alignItems="center" divider={<Divider orientation="horizontal" width="400px"/>}>
          <LetterOfReciprocity reqId={reqId} />
        </Stack>
      </>
    )
  };

  export default CreateLetterOfReciprocity;