require 'zip/zip'
require 'nokogiri'
require 'rest_client'
require 'json'
require 'pp'

BOOTSTRAP_URI = 'http://netdna.bootstrapcdn.com/bootstrap/3.0.2/css/bootstrap.min.css'
XSLT_FILE = 'widget.xslt'
DOC_FILE = 'documentation.htm'
BUNDLE_FILE = '.bundle'


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

desc 'Updates the OOI WSR API library in all subdirectories'
task :update do
  src = File.absolute_path 'wsrapi.js'
  raise "Could not find #{src}" unless File.exists?(src)
  Dir.glob('**/js').each do |subdirectory|
    dst = File.absolute_path "#{subdirectory}/wsrapi.js"
    if File.exists?(dst)
      FileUtils::cp(src, dst)
      puts "Updating #{dst}"
    end
  end
end

desc "Create documentation (#{DOC_FILE} files)"
task :doc do
  stylesheet = Nokogiri::XSLT(File.read(XSLT_FILE))
  all_human_readable_files = { }
  Dir.glob('**').each do |subdirectory|
    config_file = File.join(subdirectory, 'config.xml')
    if File.exists? config_file
      config = Nokogiri::XML(File.read(config_file))
      human_readable = stylesheet.transform config
      human_readable_file = File.join(subdirectory, DOC_FILE)
      File.write(human_readable_file, human_readable)

      puts "Writing documentation for #{subdirectory} in #{human_readable_file}"

      all_human_readable_files[subdirectory] = human_readable_file
    end
  end

  doc_index = Nokogiri::HTML::Builder.new do |doc|
    doc.html lang: 'en' do
      doc.head {
        doc.title 'Documentation index'
        doc.meta name: 'viewport', content: 'width=device-width, initial-scale=1.0'
        doc.link href: BOOTSTRAP_URI, rel: 'stylesheet'
        doc.style 'body { background-color: #eee } .container { background-color: #fff; border: 1px solid #ccc; margin-top: 1em; border-radius: 5px }', type: 'text/css'
      }
      doc.body {
        doc.div class: 'container' do
          doc.p 'Pick a widget/operator from the list below to see its automatically generated documentation:', class: 'text-info'
          doc.ul {
            all_human_readable_files.each { |k,v| doc.li { doc.a k, href: v } }
          }
        end
      }
    end
  end
  File.write(DOC_FILE, doc_index.to_html)
end

desc 'Remove generated files'
task :cleanup do
  Dir.glob('*.wgt').each do |bundledFile|
    puts "Removing old bundle: #{bundledFile}"
    File.delete bundledFile
  end
  Dir.glob("*/#{DOC_FILE}").each do |bundledFile|
    puts "Removing old documentation: #{bundledFile}"
    File.delete bundledFile
  end
  File.delete DOC_FILE if File.exists? DOC_FILE
end

desc 'Create all zipped Wirecloud widget files'
task :all => [:cleanup, :update, :doc] do
  suffix = "-git-#{run_process 'git rev-parse --short HEAD'}-#{Time.now.strftime('%y%m%d-%H%M')}"

  Dir.glob('**').each do |subdirectory|
    if File.exists?(File.join(subdirectory, BUNDLE_FILE))
      Rake::Task[:bundle].invoke subdirectory, suffix
      Rake::Task[:bundle].reenable
    end
  end
end

desc 'Update catalogue'
task :catalogue, [:username, :password] do |_, args|
  LOGIN_URI = 'https://crisma-cat.ait.ac.at/service/user/login'
  CATALOGUE_URI = 'https://crisma-cat.ait.ac.at/service/node'

  login_data = RestClient.post LOGIN_URI, { :username => args[:username], :password => args[:password] }.to_json, :content_type => :json, :accept => :json

  Dir.glob('*/.catalogue').each do |bundledFile|
    catalogue_id = File.read bundledFile
    catalogue_entry_uri = "#{CATALOGUE_URI}/#{catalogue_id}.json"
    catalogue_data = RestClient.get catalogue_entry_uri, :accept => :json, :cookies => login_data.cookies do |response, _, result|
      raise "Failed to read entry #{catalogue_id} due to HTTP code #{response.code}" if response.code != 200
      JSON.parse(result.body)
    end

    config_file = File.join(File.dirname(bundledFile), 'config.xml')
    config_data = Nokogiri::XML(File.read(config_file)).remove_namespaces!

    cfg_description = config_data.xpath('//Catalog.ResourceDescription/Description').text
    cfg_version = config_data.xpath('//Catalog.ResourceDescription/Version').text
    cfg_description_html = Nokogiri::HTML::DocumentFragment.parse ''
    Nokogiri::HTML::Builder.with cfg_description_html do |doc|
      doc.p cfg_description
    end

    catalogue_data['body']['und'][0]['value'] = cfg_description_html.to_html
    catalogue_data['field_software_version']['und'][0]['value'] = cfg_version
    catalogue_data['field_software_version']['und'][0]['safe_value'] = cfg_version

    PP.pp catalogue_data
    # TODO: Push data to remote server
  end
end

def run_process(process)
  begin
    IO.popen(process, 'r') do |p|
      return p.gets.strip
    end
  rescue
    return nil
  end
end