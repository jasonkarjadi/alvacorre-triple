import { Heading, Text } from "@chakra-ui/layout";
import Trans from "next-translate/Trans";
import { FC } from "react";

interface OverviewProps {
  ns: string[] | undefined;
}

export const Overview: FC<OverviewProps> = ({ ns }) => {
  return (
    <Trans
      i18nKey={`${ns?.length && ns[0]}:brief`}
      components={{
        Heading: <Heading fontSize="lg" mb={1} />,
        Text: <Text />,
      }}
    />
  );
};

// const TBaten: FC<ButtonProps> = (props) => {
//   return (
//     <Button
//       justifyContent="flex-start"
//       bg="tan"
//       _hover={{ bg: "orange.100", textDecor: "underline" }}
//       isFullWidth
//       {...props}
//     />
//   );
// };

// interface RelationsProps {
//   ns: string;
//   setNs: (value: SetStateAction<string>) => void;
// }

// export const Relations: FC<RelationsProps> = ({ ns }) => {
//   const [itemNum, setItemNum] = useState(0);
//   const { t } = useTranslation();

//   useEffect(() => {
//     (async () => {
//       (await import("../../locales/en/ctrys/Indonesia.json")).brief;
//     })();
//   });

//   if (itemNum) {
//     return (
//       <>
//         <Heading mb={3} fontSize="md">
//           {t(`${ns}:${itemNum}Heading`)}
//         </Heading>
//         <Text>{t(`${ns}:${itemNum}Text`)}</Text>
//       </>
//     );
//   }
//   return (
//     <>
//       <Heading fontSize="md">{t("globe:history").toUpperCase()}</Heading>
//       {[...new Array(3).keys()]
//         .map((x) => ++x)
//         .map((x) =>
//           t(`${ns}:${x}Heading`).includes(":") ? (
//             <></>
//           ) : (
//             <TBaten key={x} data-key={x} onClick={() => setItemNum(x)}>
//               {t(`${ns}:${x}Heading`)}
//             </TBaten>
//           )
//         )}
//       <Heading fontSize="md" mt={3}>
//         {t("globe:influences").toUpperCase()}
//       </Heading>
//     </>
//   );
// };
