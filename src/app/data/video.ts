
export type Video = {
    videoURL: string;
    imageURL: string
    description: string;
}

const videos: Video[] = [
    {
        videoURL: "video/DunePartTwo_Trailer01.mp4",
        imageURL: "image/Thumbnail01.png",
        description: "Trailer 01 Oficial - Dune Parte 02"
    },
    {
        videoURL: "video/DunePartTwo_Trailer02.mp4",
        imageURL: "image/Thumbnail02.png",
        description: "Trailer 02 Oficial - Dune Parte 02"
    },
    {
        videoURL: "video/DunePartTwo_Trailer03.mp4",
        imageURL: "image/Thumbnail03.png",
        description: "Trailer 03 Oficial - Dune Parte 02"
    }
]

export default videos