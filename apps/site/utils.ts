import { promises as fs } from 'fs'
import path from 'path'

import fm from 'front-matter';
import yaml from 'yaml'


const PUZZLE_ROOT = "apps/site/puzzles"

export const getPuzzlePath = (id) =>
    `apps/site/puzzles/${id}.puzzle.ts`

export const getPuzzlePaths = async () => {
    console.log(`Cwd: ${process.cwd()}`)
    const puzzleRoot = path.join(process.cwd(), PUZZLE_ROOT)
    console.log(`Puzzle Root: ${puzzleRoot}`)
    const rootPaths = await fs.readdir (puzzleRoot)
    console.log("Root paths:")
    console.table(rootPaths)
    const filteredPaths = rootPaths
        .filter(p => p.endsWith('.puzzle.ts'))
        .map(p => path.join(puzzleRoot, p))
    console.table(filteredPaths)
    return filteredPaths
}

export const getPuzzleId = (puzzlePath) => {
    const filename = path.basename(puzzlePath)
    const [ id, _ ] = filename.split('.')
    return id;
}

export const getPuzzleLink = id => `/${id}`;

export const parsePuzzle = async (puzzlePath) => {
    console.log(`Inside parsePuzzle: ${puzzlePath}`)
    const id = getPuzzleId(puzzlePath)
    const link = getPuzzleLink(id)
    const text = await fs.readFile(puzzlePath)
    const lines = text.toString().split("\n").slice(1)
    const data = fm(lines.join("\n"))
    const body = "/*\n" + data.body;
    const [prefix, rest] = body.split("// PREFIX")
    const [content, suffix] = rest.split("// SUFFIX")
    const props = { id, link, prefix, suffix, content, ...(data.attributes as object || {}) }
    return props
}

export const getPuzzles = async () => {
    const paths = await getPuzzlePaths();
    const puzzles = []
    for (const path of paths) {
        const puzzle = await parsePuzzle(path)
        puzzles.push(puzzle)
    }
    return puzzles
}

const QUESTION_ROOT = "/home/ldlework/ext/type-challenges/questions/"

export const getQuestionPaths = async () => {
    const paths = await fs.readdir(QUESTION_ROOT);
    return paths.map(p => path.join(QUESTION_ROOT, p))
}

export const getQuestionDirectories = () =>
    fs.readdir(QUESTION_ROOT)

export const getQuestionReadmeFilename = (questionPath) =>
    path.join(questionPath, 'README.md')

export const getQuestionInfoFilename = (questionPath) =>
    path.join(questionPath, 'info.yml')

export const getQuestionTemplateFilename = (questionPath) =>
    path.join(questionPath, 'template.ts')

export const getQuestionTestCasesFilename = (questionPath) =>
    path.join(questionPath, 'test-cases.ts')

export const parseQuestionDir = (path: string) =>
    path.split('-', 3)

export const parseQuestion = async (dir: string) => {
    const questionPath = path.join(QUESTION_ROOT, dir)
    const [id, challenge, _] = parseQuestionDir(dir)
    const readmeFilename = getQuestionReadmeFilename(questionPath)
    const infoFilename = getQuestionInfoFilename(questionPath)
    const templateFilename = getQuestionTemplateFilename(questionPath)
    const casesFilename = getQuestionTestCasesFilename(questionPath)

    return {
        dir, id, challenge,
        info:  yaml.parse((await fs.readFile(infoFilename)).toString()),
        prefix: (await fs.readFile(readmeFilename)).toString(),
        suffix: (await fs.readFile(casesFilename)).toString(),
        content: (await fs.readFile(templateFilename)).toString(),
    }
}

export const getQuestions = async () => {
    const directories = await getQuestionDirectories()
    const questions = []
    for (const dir of directories) {
        const question = await parseQuestion(dir)
        questions.push(question)
    }
    return questions
}
