require 'zip/zip'
require_relative 'rake_helper'

desc 'Create zipped Wirecloud widget file for the specified project'
task :bundle, [:what, :suffix] do |_, args|
  args.with_defaults(:suffix => '')
  project = args[:what]
  archive = "#{project}#{args[:suffix]}.wgt"

  if project && Dir.exists?(project)
    File.delete(archive) if File.exists?(archive)
    puts "Bundling #{project} as #{archive}..."

    Zip::ZipFile.open(archive, Zip::ZipFile::CREATE) do |z|
      Dir[File.join(project, '**', '**')].each do |file|
        z.add(file.sub("#{project}/", ''), file) unless /[a-z]+\.md/i =~ file
      end
    end
  end
end

desc 'Created endpoint documentation (ENDPOINTS.md files) -- DEPRECATED'
task :doc do
  puts 'WARNING! This task is deprecated! It will soon be replaced by an XSLT variant!'
  Dir.glob('**').each do |subdirectory|
    config_file = File.join(subdirectory, 'config.xml')
    create_doc_for(config_file, File.join(subdirectory, 'ENDPOINTS.md')) if File.exists? config_file
  end
end

desc 'Remove generated files'
task :cleanup do
  Dir.glob('*.wgt').each do |bundledFile|
    puts "Removing old file: #{bundledFile}"
    File.delete bundledFile
  end
end

desc 'Create all zipped Wirecloud widget files'
task :all => :cleanup do
  suffix = "-#{Time.now.strftime('%y%m%d-%H%M')}-git-#{run_process 'git rev-parse --short HEAD'}"

  Dir.glob('**').each do |subdirectory|
    if File.exists?(File.join(subdirectory, '.bundle'))
      Rake::Task[:bundle].invoke subdirectory, suffix
      Rake::Task[:bundle].reenable
    end
  end
end