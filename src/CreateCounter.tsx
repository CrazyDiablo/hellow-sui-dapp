import { TransactionBlock } from "@mysten/sui.js/transactions";
import { Button, Container } from "@radix-ui/themes";
import {
  useSignAndExecuteTransactionBlock,
  useSuiClient,
} from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";

export function CreateCounter({
  onCreated,
}: {
  onCreated: (id: string) => void;
}) {
  const client = useSuiClient();
  const counterPackageId = useNetworkVariable("counterPackageId");
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();

  return (
    <Container>
      <Button
        size="3"
        onClick={() => {
          create();
        }}
      >
        Create Counter
      </Button>
    </Container>
  );

  function create() {
    const txb = new TransactionBlock();
console.log('counterPackageId', counterPackageId)
    txb.moveCall({
      arguments: [],
      target: `${counterPackageId}::counter::create`,
    });

    console.log('执行 signAndExecute')
    signAndExecute(
      {
        transactionBlock: txb,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      },
      {
        onSuccess: (tx) => {
          console.log('onSuccess')
          client
            .waitForTransactionBlock({
              digest: tx.digest,
            })
            .then(() => {
              const objectId = tx.effects?.created?.[0]?.reference?.objectId;
              console.log('objectId', objectId)
              if (objectId) {
                onCreated(objectId);
              }
            }).catch((err) => console.log('err', err));
        },
        onError: (err) => {
          console.log('onError err', err)
        }
      },
    );
  }
}
