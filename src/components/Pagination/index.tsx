import {
    ArrowLongLeftIcon,
    ArrowLongRightIcon,
} from '@heroicons/react/20/solid'
import { Button, Flex, Text } from '@tremor/react'

type IpProps = {
    onClickNext?: any
    onClickPrevious?: any
    pageCount?: any
    currentPage?: any
}

export default function Pagination({
    onClickNext,
    onClickPrevious,
    pageCount,
    currentPage,
}: IpProps) {
    return (
        <Flex className="border-t border-gray-200 pt-2">
            <Button
                disabled={currentPage === 1}
                variant="light"
                icon={ArrowLongLeftIcon}
                onClick={onClickPrevious}
            >
                previous
            </Button>
            <Text className="hidden md:flex">
                page {currentPage} of {pageCount}
            </Text>
            <Button
                disabled={currentPage >= pageCount}
                variant="light"
                onClick={onClickNext}
                icon={ArrowLongRightIcon}
                iconPosition="right"
            >
                next
            </Button>
        </Flex>
    )
}
